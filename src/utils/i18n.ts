import type { Lang, Language } from "../types/lang.types";

export const languages: Language[] = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
];

export const supportedLanguages: Lang[] = languages.map(l => l.code);
export const defaultLang: Lang = 'es';

export function isValidLang(lang: string | undefined): lang is Lang {
    return !!lang && supportedLanguages.includes(lang as Lang);
}