// src/lib/auth-actions.ts
import { db, User, Account, eq, and } from 'astro:db';
import { nanoid } from 'nanoid';
import { createSession } from './auth';

type Provider = 'google' | 'twitch' | 'facebook' | 'twitter';

export async function loginOrRegister(
    provider: Provider,
    providerAccountId: string,
    userData: { username: string; avatar?: string },
    currentUserId?: string // <-- Clave: Si viene esto, estamos VINCULANDO
) {

    // 1. ¿Esta cuenta de social ya existe en nuestra DB?
    const existingAccount = await db.select()
        .from(Account)
        .where(and(
            eq(Account.provider, provider),
            eq(Account.providerAccountId, providerAccountId)
        ))
        .get();

    // CASO A: La cuenta ya existe -> Login normal
    if (existingAccount) {
        return await createSession(existingAccount.userId);
    }

    // CASO B: La cuenta NO existe, pero el usuario ya está logueado -> VINCULAR
    if (currentUserId) {
        await db.insert(Account).values({
            provider,
            providerAccountId,
            userId: currentUserId
        });
        return await createSession(currentUserId);
    }

    // CASO C: Usuario totalmente nuevo -> REGISTRO
    const newUserId = nanoid();

    // Primero creamos el Usuario
    await db.insert(User).values({
        id: newUserId,
        username: userData.username,
        avatar: userData.avatar
    });

    // Luego creamos su Cuenta (la llave)
    await db.insert(Account).values({
        provider,
        providerAccountId,
        userId: newUserId
    });

    return await createSession(newUserId);
}