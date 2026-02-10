export function getValidPage(page: string | null): number {
    if (!page) return 1;
    const pageNumber = parseInt(page);
    return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
}

export function isPaginationActive(url: URL): boolean {
    return url.searchParams.has("page");
}
