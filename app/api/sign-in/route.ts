import { NextResponse } from "next/server"
import { signIn } from "@/actions/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const result = await signIn({ email, password })
    return NextResponse.json(result, { status: result.error ? 401 : 200 })
  } catch (e) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }
}
