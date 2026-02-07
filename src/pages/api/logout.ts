import type { APIRoute } from "astro";
import { db, Session, eq } from "astro:db";

export const POST: APIRoute = async (context) => {
    if (context.locals.session) {
        await db.delete(Session).where(eq(Session.id, context.locals.session.id));
    }

    context.cookies.delete("session_id", {
        path: "/",
    });

    return context.redirect("/");
};