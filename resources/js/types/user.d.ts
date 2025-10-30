import type { WalletType } from './global';
export interface UserType {
    no?: number;
    id: string;
    name: string;
    username: string;
    role: number;
    role_text?: string;
    tier?: number;
    tier_text?: string;
    exp?: number;
    paid_at: string | null;
    wallet: WalletType;
    retrieval_at?: string;
    rank: UserRankType;
    email_verified_at: string;
    custom_rate: number;
    email: string;
    created_at: string;
    updated_at: string;
}


export interface UserGuast {
    id: string;
    avatar?: string
    name: string;
    username: string;
    tier_text: string;
    rank: UserRankType;
}

export interface UserRankType {
    id: string;
    user_id: string;
    level: number;
    level_text: string;
    level_json: {
        id: number;
        name: string;
        min_exp: number;
        max_exp: number;
        rate: number;
    };
    score: number;
    season: UserSeasonType;
    type: number;
    type_text: string;
    season_id: string;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    user?: UserGuast;
}

export interface UserSeasonType {
    id: string;
    name: string;
    season_index: number;
    status: number;
    status_text: string;
    total_users: number;
    type: number;
    type_text: string;
    deleted_at: string;
    updated_at: string;
    created_at: string;
}
