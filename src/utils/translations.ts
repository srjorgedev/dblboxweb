import type { Lang } from "../types/lang.types";

export const translations = {
    es: {
        nav: {
            characters: "Personajes",
            equips: "Fragmentos",
            tiermaker: "TierMaker",
            conceptmaker: "Concept Maker",
        },
        filterSection: {
            title: "Filtros",
            tagLabel: "Etiqueta",
            chapterLabel: "Capitulo",
            colorLabel: "Afinidad",
            typeLabel: "Tipo",
            rarityLabel: "Rareza"
        },
        error: {
            title: "UPS...",
            description: "Parece que la página que buscas no existe."
        }
    },
    en: {
        nav: {
            characters: "Characters",
            equips: "Equipment",
            tiermaker: "TierMaker",
            conceptmaker: "Concept Maker",
        },
        filterSection: {
            title: "Filters",
            tagLabel: "Tag",
            chapterLabel: "Chapter",
            colorLabel: "Affinity",
            typeLabel: "Type",
            rarityLabel: "Rarity"
        },
        error: {
            title: "UPS...",
            description: "It seems that the page you are looking for does not exist."
        }
    }
} as const;

export function getTranslations(lang: Lang) {
    return translations[lang] || translations['es'];
}
