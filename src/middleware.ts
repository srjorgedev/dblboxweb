// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { validateSession } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
    const sessionId = context.cookies.get("session_id")?.value;

    if (sessionId) {
        const data = await validateSession(sessionId);
        if (data) {
            context.locals.user = data.user;
            context.locals.session = data.session;
        } else {
            context.locals.user = null;
            context.locals.session = null;
            context.cookies.delete("session_id", { path: "/" });
        }
    } else {
        context.locals.user = null;
        context.locals.session = null;
    }

    const url = new URL(context.request.url);
    const pathname = url.pathname;
    
    const dashboardMatch = pathname.match(/^\/([a-z]{2})\/dashboard(\/.*)?$/);
    
    if (dashboardMatch) {
        const lang = dashboardMatch[1];
        const user = context.locals.user;

        if (!user) {
            return context.redirect(`/${lang}/login`);
        }

        if (user.role !== "user") {
            return new Response("Unauthorized: Admin role required", { status: 403 });
        }
    }

    const response = await next();

    if (response.status === 404) {
        console.log("Detectado error 404 para:", context.url.pathname);
    }

    return response;
});