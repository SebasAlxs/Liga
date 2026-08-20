export interface UserResponse {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserRequest {
    email?: string;
    password?: string;
    role?: string;
}
