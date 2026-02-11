import type { APIRoute } from "astro";
import { db, User, Account, eq, and } from "astro:db";
import { nanoid } from "nanoid";
import { hashPassword } from "../../../lib/password";
import { createSession } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const lang = formData.get("lang")?.toString() || "es";

    if (typeof email !== "string" || typeof password !== "string" || typeof username !== "string") {
        return redirect(`/${lang}/register?error=invalid_form`);
    }

    if (password.length < 8) {
        return redirect(`/${lang}/register?error=password_too_short`);
    }

    // Check if account already exists
    const existingAccount = await db.select()
        .from(Account)
        .where(and(
            eq(Account.provider, "password"),
            eq(Account.email, email)
        ))
        .get();

    if (existingAccount) {
        return redirect(`/${lang}/register?error=user_exists`);
    }

    try {
        const userId = nanoid();
        const hashedPassword = await hashPassword(password);

        // Create user
        await db.insert(User).values({
            id: userId,
            username: username,
            role: "user"
        });

        // Create account
        await db.insert(Account).values({
            provider: "password",
            providerAccountId: email, // simple unique ID for local accounts
            userId: userId,
            email: email,
            passwordHash: hashedPassword
        });

        const session = await createSession(userId);

        cookies.set("session_id", session.id, {
            path: "/",
            httpOnly: true,
            secure: import.meta.env.PROD,
            maxAge: 60 * 60 * 24 * 30,
        });

        return redirect(`/${lang}/`);

    } catch (e) {
        console.error(e);
        return new Response("Internal Server Error", { status: 500 });
    }
};
