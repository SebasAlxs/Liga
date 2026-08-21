export interface ModuleAccessResponse {
    _id: string;
    role: string;
    module: string;
    visible: boolean;
}

export interface UpdateModuleAccessRequest {
    items: { role: string; module: string; visible: boolean }[];
}
