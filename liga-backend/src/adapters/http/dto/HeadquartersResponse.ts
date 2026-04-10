export interface CreateHeadquartersRequest {
    name: string;
    city?: string;
    address?: string;
    active?: boolean;
}

export interface UpdateHeadquartersRequest {
    name?: string;
    city?: string;
    address?: string;
    active?: boolean;
}

export interface HeadquartersResponse {
    id: string;
    name: string;
    city?: string;
    address?: string;
    active: boolean;
}
