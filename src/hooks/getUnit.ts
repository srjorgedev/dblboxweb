import type { UnitData } from "../types/unit.types";

const PUBLIC_API_URL: string = import.meta.env.PUBLIC_API_URL;
const PUBLIC_API_CURRENT_VERSION: string = import.meta.env.PUBLIC_API_CURRENT_VERSION;

export async function getUnit(lang: string, id: string): Promise<UnitData> {
    const url = `${PUBLIC_API_URL}${PUBLIC_API_CURRENT_VERSION}/unit/${id}?lang=${lang}`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error("Failed to fetch unit summaries:", response.statusText);
        throw new Error("Failed to fetch unit summaries");
    }

    return response.json();
}