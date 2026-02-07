import type { UnitData } from "../types/unit.types";

const API_URL: string = import.meta.env.API_URL;
const API_CURRENT_VERSION: string = import.meta.env.API_CURRENT_VERSION;

export async function getUnit(lang: string, id: string): Promise<UnitData> {
    const url = `${API_URL}${API_CURRENT_VERSION}/unit/${id}?lang=${lang}`;
    console.log({url})

    const response = await fetch(url);
    if (!response.ok) {
        console.error("Failed to fetch unit summaries:", response.statusText);
        throw new Error("Failed to fetch unit summaries");
    }

    return response.json();
}