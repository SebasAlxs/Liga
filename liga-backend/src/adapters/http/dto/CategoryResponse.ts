export interface CategoryResponse {
    _id: string;
    name: string;
    minAge?: number | null;
    maxAge?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    minAge?: number;
    maxAge?: number;
}

export interface UpdateCategoryRequest {
    name: string;
    minAge?: number;
    maxAge?: number;
}
