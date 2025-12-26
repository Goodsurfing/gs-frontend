export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationIdParams {
    id: number;
    page: number;
    limit: number;
}
