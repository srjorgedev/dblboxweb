// src/lib/auth.ts
import { db, Session, User, eq } from 'astro:db';
import { nanoid } from 'nanoid';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export async function createSession(userId: string) {
    const sessionId = nanoid();
    const expiresAt = Date.now() + (DAY_IN_MS * 30); 

    await db.insert(Session).values({
        id: sessionId,
        userId,
        expiresAt
    });

    return { id: sessionId, expiresAt };
}

export async function validateSession(sessionId: string) {
    const result = await db.select({
        user: User,
        session: Session
    })
        .from(Session)
        .innerJoin(User, eq(Session.userId, User.id))
        .where(eq(Session.id, sessionId))
        .get();

    if (!result) return null; 

    if (Date.now() > result.session.expiresAt) {
        await db.delete(Session).where(eq(Session.id, sessionId));
        return null;
    }

    return { session: result.session, user: result.user };
}