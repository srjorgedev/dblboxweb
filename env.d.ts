/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        lang: 'es' | 'en';
        sort: "history" | "rarity";
        pagination: {
            usePages: boolean;
            currentPage: number;
            limit: number;
        };
        theme: "dark" | "light";
        session: import("astro:db").Session | null;
        user: import("astro:db").User | null;
        errorMessage: string | null;
    }
}