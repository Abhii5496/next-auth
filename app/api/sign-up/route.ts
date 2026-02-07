import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { supabaseAdmin } from "@/utils/supabase/supabase-admin"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    console.log(email, password)

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    try {
      const origin = (await headers()).get("origin");
      const supabase = await createClient(await cookies());
      const { error, data: newUser } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${origin}/auth/confirm`,
          data: {
            name: email.split("@")[0],
            avatar: "https://ui-avatars.com/api/?name=" + email.split("@")[0],
            password: password,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error.message);
        throw new Error(error.message);
      }

      if (!newUser?.user) {
        throw new Error("No user data returned from signup.");
      }


      return NextResponse.json(
        { error: null, message: "Account created successfully." },
        { status: 200 }
      )
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message || "Unable to sign up." },
        { status: 400 }
      )
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }
}
