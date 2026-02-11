// src/lib/auth-actions.ts
import { db, User, Account, eq, and } from 'astro:db';
import { nanoid } from 'nanoid';
import { createSession } from './auth';

type Provider = 'google' | 'twitch' | 'facebook' | 'twitter';

export async function loginOrRegister(
    provider: Provider,
    providerAccountId: string,
    userData: { username: string; avatar?: string; email?: string },
    currentUserId?: string // <-- Clave: Si viene esto, estamos VINCULANDO
) {

    const existingAccount = await db.select()
        .from(Account)
        .where(and(
            eq(Account.provider, provider),
            eq(Account.providerAccountId, providerAccountId)
        ))
        .get();

    if (existingAccount) {
        if (currentUserId && existingAccount.userId !== currentUserId) {
            throw new Error("This account is already linked to another user.");
        }
        return await createSession(existingAccount.userId);
    }

    // CASO B: La cuenta NO existe, pero el usuario ya está logueado -> VINCULAR
    if (currentUserId) {
        await db.insert(Account).values({
            provider,
            providerAccountId,
            userId: currentUserId,
            email: userData.email
        });
        return await createSession(currentUserId);
    }

    // CASO AUTO-LINK: Si el email ya existe en otra cuenta (ej: password login)
    if (userData.email) {
        const accountWithSameEmail = await db.select()
            .from(Account)
            .where(eq(Account.email, userData.email))
            .get();
        
        if (accountWithSameEmail) {
            // Vinculamos automáticamente a este usuario existente
            await db.insert(Account).values({
                provider,
                providerAccountId,
                userId: accountWithSameEmail.userId,
                email: userData.email
            });
            return await createSession(accountWithSameEmail.userId);
        }
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
        userId: newUserId,
        email: userData.email
    });

    return await createSession(newUserId);
}