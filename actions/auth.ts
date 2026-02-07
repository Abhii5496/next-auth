"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

type AuthCredType = {
    email: string;
    password: string;
};


export async function login({ email, password }: AuthCredType) {
    const supabase = await createClient(await cookies());

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            console.error("Login error:", error.message);
            return { error: "Invalid credentials", user: null };
        }

        console.error("Unexpected login error:", error.message);
        return { error: error.message, user: null };
    }

    return { error: null, user: data.user };
}

export async function signUp({ email, password }: AuthCredType) {
    const supabase = await createClient(await cookies());
    const origin = (await headers()).get("origin");

    const { error, data: newUser } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
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

    return { error: null, user: newUser.user };
}

export async function signIn({ email, password }: AuthCredType) {
    const supabase = await createClient(await cookies());
    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            console.error("Sign in error:", error.message);
            return { error: "Invalid credentials", user: null };
        }

        console.error("Unexpected sign in error:", error.message);
        return { error: error.message, user: null };
    }
    if (!data.user) {
        return { error: "No user data returned from signin.", user: null };
    }
    return { error: null, user: data.user };
}

export async function getUserProfile() {
    const supabase = await createClient(await cookies());
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        console.error("Auth error fetching user:", authError);
        throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!user) {
        return null;
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Database error fetching user profile:", error);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;
}

export async function logout() {
    const supabase = await createClient(await cookies());
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout error:", error);
        throw new Error(`Failed to log out: ${error.message}`);
    }
    return { success: true };
}
