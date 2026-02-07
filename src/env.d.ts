/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        session: import("astro:db").Session | null;
        user: import("astro:db").User | null;
        errorMessage: string | null;
    }
}