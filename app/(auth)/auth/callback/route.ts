import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  console.log(request.url)
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/"
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/"
  }

  if (code) {
    const supabase = await createClient(await cookies())
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    const { session, user } = data


    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(
        `${origin}/auth/error?error=Verification&error_description=${encodeURIComponent(error.message)}`
      )
    }
    if (!session?.user) {
      return NextResponse.redirect(
        `${origin}/auth/error?error=Default&error_description=No user found in session`
      )
    }

    return NextResponse.redirect(`${origin}/`)
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=Default&error_description=Missing or invalid authorization code`
  )
}
