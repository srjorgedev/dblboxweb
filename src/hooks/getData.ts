import type { Tag, Data } from "../types/data.types";

const PUBLIC_API_URL: string = import.meta.env.PUBLIC_API_URL;
const PUBLIC_API_CURRENT_VERSION: string = import.meta.env.PUBLIC_API_CURRENT_VERSION;

export async function getAllTags(lang: string): Promise<Tag[]> {
    const url = `${PUBLIC_API_URL}${PUBLIC_API_CURRENT_VERSION}/data/tag/all?lang=${lang}`;

    const data = await fetch(url)
    if (!data.ok) {
        console.error("Failed to fetch data:", data.statusText);
        throw new Error("Failed to fetch data");
    }

    return data.json();
}

export async function getAllData(from: string, lang: string): Promise<Data[]> {
    const url = `${PUBLIC_API_URL}${PUBLIC_API_CURRENT_VERSION}/data/${from}/all?lang=${lang}`;

    const data = await fetch(url)
    if (!data.ok) {
        console.error("Failed to fetch data:", data.statusText);
        throw new Error("Failed to fetch data");
    }

    return data.json();
}
