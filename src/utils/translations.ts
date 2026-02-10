import type { Lang } from "../types/lang.types";

export const translations = {
    es: {
        nav: {
            characters: "Personajes",
            equips: "Fragmentos",
            tiermaker: "TierMaker",
            conceptmaker: "Concept Creator",
        },
        optionsSection: { title: "Opciones" },
        filterSection: {
            title: "Filtros",
            tagLabel: "Etiqueta",
            chapterLabel: "Capitulo",
            colorLabel: "Afinidad",
            typeLabel: "Tipo",
            rarityLabel: "Rareza",
            clear: "Limpiar filtros"
        },
        viewSection: {
            title: "Ver",
            all: "Todo",
            pages: "Paginas",
            next: "Siguiente",
            back: "Atras"
        },
        sortSection: {
            title: "Ordenar",
            history: "Historia",
            rarity: "Rareza"
        },
        search: "Buscar por nombre...",
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
            conceptmaker: "Concept Creator",
        },
        optionsSection: { title: "Options" },
        filterSection: {
            title: "Filters",
            tagLabel: "Tag",
            chapterLabel: "Chapter",
            colorLabel: "Affinity",
            typeLabel: "Type",
            rarityLabel: "Rarity",
            clear: "Clear filters"
        },
        sortSection: {
            title: "Sort",
            history: "History",
            rarity: "Rarity"
        },
        viewSection: {
            title: "Mode",
            all: "All",
            pages: "Pages",
            next: "Next",
            back: "Back"
        },
        search: "Search by name...",
        error: {
            title: "UPS...",
            description: "It seems that the page you are looking for does not exist."
        }
    }
} as const;

export function getTranslations(lang: Lang) {
    return translations[lang] || translations['es'];
}
