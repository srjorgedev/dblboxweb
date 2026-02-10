import type { APIRoute } from "astro";
import { db, User, eq } from "astro:db";
import { validateSession } from "@/lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
    const sessionId = cookies.get("session_id")?.value;
    if (!sessionId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const data = await validateSession(sessionId);
    if (!data || data.user.role !== "admin") {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role || (role !== "admin" && role !== "user")) {
            return new Response("Invalid request", { status: 400 });
        }

        await db.update(User)
            .set({ role })
            .where(eq(User.id, userId));

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response("Error updating role", { status: 500 });
    }
};
