import { VALID_SORT_OPTIONS, type SortOption } from "../types/unit.types";

export const DEFAULT_SORT: SortOption = "history";

export function isValidSort(sort: string | null): sort is SortOption {
    return VALID_SORT_OPTIONS.includes(sort as SortOption);
}

export function getValidSort(sort: string | null): SortOption {
    if (isValidSort(sort)) {
        return sort;
    }
    return DEFAULT_SORT;
}
