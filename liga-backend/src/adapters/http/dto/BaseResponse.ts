export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
}

export interface BaseResponse<T = any> {
    status: boolean;
    message: string;
    data?: T;
    pagination?: Pagination;
    fieldValidations?: Record<string, any>;
}
