import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'

export default async function HomePage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    // if (!user) {
    //     redirect('/login')
    // }

    return (
        <main className="min-h-screen bg-muted/30">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                    <h1 className="text-sm font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                            {user?.email}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-lg font-medium">Welcome back</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You are signed in. This page is protected and only visible when authenticated.
                    </p>
                </div>
            </div>
        </main>
    )
}
