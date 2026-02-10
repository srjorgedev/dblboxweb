// src/pages/login/google/callback.ts
import { google } from "../../../lib/oauth";
import { loginOrRegister } from "../../../lib/auth-actions";
import { validateSession } from "../../../lib/auth";
import { OAuth2RequestError } from "arctic";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");

    const storedState = context.cookies.get("google_oauth_state")?.value;
    const storedCodeVerifier = context.cookies.get("google_code_verifier")?.value;

    console.log("--- GOOGLE CALLBACK DEBUG ---");
    console.log({ code: !!code, state, storedState, storedCodeVerifier });

    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
        console.error("❌ Fallo en validación de cookies o state");
        return new Response("Error: Faltan cookies o state mismatch", { status: 400 });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
        console.log("✅ Tokens obtenidos correctamente");

        const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` }
        });
        const googleUser = await googleUserResponse.json();

        const currentSessionId = context.cookies.get("session_id")?.value;
        let currentUserId = undefined;

        if (currentSessionId) {
            const sessionData = await validateSession(currentSessionId);
            if (sessionData) currentUserId = sessionData.user.id;
        }

        const session = await loginOrRegister(
            'google',
            googleUser.sub,
            { username: googleUser.name, avatar: googleUser.picture },
            currentUserId
        );

        context.cookies.set("session_id", session.id, {
            path: "/",
            httpOnly: true,
            secure: import.meta.env.PROD,
            maxAge: 60 * 60 * 24 * 30,
        });

        return context.redirect("/");

    } catch (e) {
        console.error("❌ Error en try/catch:", e);
        if (e instanceof OAuth2RequestError) {
            return new Response("Error: Token inválido de Google", { status: 400 });
        }
        return new Response("Error Interno", { status: 500 });
    }
}