import type { UnitsResponse, SortOption } from "../types/unit.types";

const PUBLIC_API_URL: string = import.meta.env.PUBLIC_API_URL;
const PUBLIC_API_CURRENT_VERSION: string = import.meta.env.PUBLIC_API_CURRENT_VERSION;

export async function getAllUnits(lang: string, sort = "history", page: number = 1, limit: number = 1000): Promise<UnitsResponse> {
    const url = new URL(`${PUBLIC_API_URL}${PUBLIC_API_CURRENT_VERSION}/unit/all`);
    url.searchParams.append("lang", lang);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("page", page.toString());
    url.searchParams.append("order", sort)

    const response = await fetch(url.toString());

    if (!response.ok) {
        console.error("Failed to fetch unit summaries:", response.statusText);
        throw new Error("Failed to fetch unit summaries");
    }

    return response.json();
}