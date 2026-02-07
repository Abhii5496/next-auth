'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function SignUpPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const passwordConfirm = formData.get('password-confirm') as string
        console.log(email, password, passwordConfirm)
        if (!email || !password || !passwordConfirm) {
            setError('Email and password are required')
            return
        }
        if (password !== passwordConfirm) {
            setError('Passwords do not match')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        setError(null)
        setIsPending(true)
        try {
            const { data } = await axios.post('/api/sign-up',
                { email, password }
            )
            if (data.error) {
                setError(data.error)
                return
            }
            router.push('/')
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">

            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-xl font-semibold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email and a password to sign up.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div
                                role="alert"
                                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            >
                                {error}
                            </div>
                        )}
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                                <Input
                                    id="signup-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    disabled={isPending}
                                    className="h-9"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="signup-password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        required
                                        minLength={8}
                                        disabled={isPending}
                                        className="h-9 pr-9"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none disabled:pointer-events-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="size-4" weight="regular" />
                                        ) : (
                                            <EyeIcon className="size-4" weight="regular" />
                                        )}
                                    </button>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="signup-password-confirm">Confirm Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="signup-password-confirm"
                                        name="password-confirm"
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        required
                                        minLength={8}
                                        disabled={isPending}
                                        className="h-9 pr-9"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPasswordConfirm((p) => !p)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none disabled:pointer-events-none"
                                        aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeSlashIcon className="size-4" weight="regular" />
                                        ) : (
                                            <EyeIcon className="size-4" weight="regular" />
                                        )}
                                    </button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating account…' : 'Sign up'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>

        </main>
    )
}
