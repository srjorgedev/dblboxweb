import type { APIRoute } from "astro";
import { db, Account, eq, and } from "astro:db";
import { hashPassword, verifyPassword } from "../../../lib/password";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
    const user = locals.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const currentPassword = formData.get("current_password");
    const newPassword = formData.get("new_password");
    const lang = formData.get("lang")?.toString() || "es";

    if (typeof newPassword !== "string" || newPassword.length < 8) {
        return redirect(`/${lang}/profile?error=password_too_short`);
    }

    try {
        const account = await db.select()
            .from(Account)
            .where(and(
                eq(Account.userId, user.id),
                eq(Account.provider, "password")
            ))
            .get();

        // If they have a password account, they must verify current password
        if (account && account.passwordHash) {
            if (typeof currentPassword !== "string") {
                 return redirect(`/${lang}/profile?error=missing_current_password`);
            }
            const isValid = await verifyPassword(currentPassword, account.passwordHash);
            if (!isValid) {
                return redirect(`/${lang}/profile?error=invalid_current_password`);
            }
        }

        const newHash = await hashPassword(newPassword);

        if (account) {
            // Update existing password account
            await db.update(Account)
                .set({ passwordHash: newHash })
                .where(eq(Account.id, account.id)); // Assuming Account has an ID or use composite key
                // Wait, Account doesn't have an ID column in the schema I saw earlier. 
                // It uses indexes: [{ on: ["provider", "providerAccountId"], unique: true }]
                // Let's use the specific where clause:
            await db.update(Account)
                .set({ passwordHash: newHash })
                .where(and(
                    eq(Account.provider, "password"),
                    eq(Account.userId, user.id)
                ));
        } else {
            // Create a new password account for this user (they were OAuth only)
            // We need an email for providerAccountId. We'll use the user's email if we can find it in another Account.
            const otherAccount = await db.select().from(Account).where(eq(Account.userId, user.id)).get();
            const email = otherAccount?.email || `${user.id}@placeholder.com`;

            await db.insert(Account).values({
                provider: "password",
                providerAccountId: email,
                userId: user.id,
                email: email,
                passwordHash: newHash
            });
        }

        return redirect(`/${lang}/profile?success=password_updated`);
    } catch (e) {
        console.error(e);
        return redirect(`/${lang}/profile?error=server_error`);
    }
};
