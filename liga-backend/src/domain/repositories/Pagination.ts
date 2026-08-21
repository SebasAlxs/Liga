export interface PaginationParams {
    skip?: number;
    take?: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
}
