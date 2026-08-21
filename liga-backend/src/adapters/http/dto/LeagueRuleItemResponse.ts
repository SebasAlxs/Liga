export interface LeagueRuleItemResponse {
    _id: string;
    title: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeagueRuleItemRequest {
    title: string;
    description?: string;
}

export interface UpdateLeagueRuleItemRequest {
    title?: string;
    description?: string;
}
