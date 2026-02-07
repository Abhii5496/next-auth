import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/utils/supabase/supabase-admin"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  if (token_hash && type) {
    const supabase = await createClient(await cookies())
    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    console.log("Verify OTP result - error:", error)
    console.log("Verify OTP result - has session:", !!data?.session)

    if (!error && data.session) {
      // console.log("data.session", JSON.stringify(data, null, 2))

      if (data.session.user.email) {
        const fullName =
          data.session.user.user_metadata?.full_name ??
          (data.session.user.user_metadata?.name as string | undefined) ??
          ""
        const nameParts = fullName.trim().split(/\s+/)
        const fname = nameParts[0] ?? null
        const lname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null

        const payload = {
          id: data.session.user.id,
          email: data.session.user.email,
          fname,
          lname,
          avatar:
            (data.session.user.user_metadata?.avatar_url ??
              data.session.user.user_metadata?.avatar) ?? null,
          is_active: true,
          provider: data.session.user.app_metadata?.provider ?? null,
          updated_at: data.session.user.updated_at,
        }

        const { error: insertError } = await supabaseAdmin
          .from("users")
          .upsert(payload, {
            onConflict: "email",
            ignoreDuplicates: false,
          })

        if (insertError) {
          console.error("Failed to upsert user into public.users:", insertError)
          redirect(
            `/auth/error?error=Database&error_description=${encodeURIComponent(insertError.message)}`
          )
        }
      }
      revalidatePath("/", "layout")
      redirect("/")
    } else if (error) {
      console.error("OTP verification error:", error)
      redirect("/auth/error?error=Verification")
    }
  } else {
    console.warn("Missing required parameters - token_hash or type is missing")
  }

  // redirect the user to the auth error page
  redirect("/auth/error?error=Verification")
}