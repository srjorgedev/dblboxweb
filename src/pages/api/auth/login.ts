import type { APIRoute } from "astro";
import { db, Account, eq, and } from "astro:db";
import { verifyPassword } from "../../../lib/password";
import { createSession } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const lang = formData.get("lang")?.toString() || "es";

    if (typeof email !== "string" || typeof password !== "string") {
        return redirect(`/${lang}/login?error=invalid_form`);
    }

    const account = await db.select()
        .from(Account)
        .where(and(
            eq(Account.provider, "password"),
            eq(Account.email, email)
        ))
        .get();

    if (!account || !account.passwordHash) {
        return redirect(`/${lang}/login?error=invalid_credentials`);
    }

    const isValidPassword = await verifyPassword(password, account.passwordHash);

    if (!isValidPassword) {
        return redirect(`/${lang}/login?error=invalid_credentials`);
    }

    const session = await createSession(account.userId);

    cookies.set("session_id", session.id, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 * 30,
    });

    return redirect(`/${lang}/`);
};
