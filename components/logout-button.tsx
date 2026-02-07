'use client'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { SignOutIcon } from '@phosphor-icons/react'

export function LogoutButton() {

    async function handleLogout() {
        try {
            await logout()
        } catch (error) {
            console.error("Logout error:", error)
            window.alert("Failed to log out")
        }
    }
    return (
        <form onSubmit={handleLogout}>
            <Button type="submit" variant="outline" size="sm" className="cursor-pointer">
                Log out
                <SignOutIcon className="size-4" weight="regular" />
            </Button>
        </form>
    )
}
