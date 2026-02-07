'use client'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
    return (
        <form action={async () => {
            await logout()
        }}>
            <Button type="submit" variant="outline" size="sm">
                Log out
            </Button>
        </form>
    )
}
