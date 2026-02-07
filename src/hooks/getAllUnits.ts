import type { UnitsResponse } from "../types/unit.types";

const API_URL: string = import.meta.env.API_URL;
const API_CURRENT_VERSION: string = import.meta.env.API_CURRENT_VERSION;

export async function getAllUnits(lang: string): Promise<UnitsResponse> {

    const url = new URL(`${API_URL}${API_CURRENT_VERSION}/unit/all`);
    url.searchParams.append("lang", lang);
    // url.searchParams.append("limit", "10");
    // url.searchParams.append("page", "1");
    
    console.log(url.toString())

    const response = await fetch(url.toString());

    if (!response.ok) {
        console.error("Failed to fetch unit summaries:", response.statusText);
        throw new Error("Failed to fetch unit summaries");
    }

    return response.json();
}