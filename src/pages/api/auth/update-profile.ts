import type { APIRoute } from "astro";
import { db, User, eq } from "astro:db";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
    const user = locals.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const username = formData.get("username");
    const lang = formData.get("lang")?.toString() || "es";

    if (typeof username !== "string" || username.length < 3) {
        return redirect(`/${lang}/profile?error=invalid_username`);
    }

    try {
        await db.update(User)
            .set({ username })
            .where(eq(User.id, user.id));

        return redirect(`/${lang}/profile?success=profile_updated`);
    } catch (e) {
        console.error(e);
        return redirect(`/${lang}/profile?error=server_error`);
    }
};
