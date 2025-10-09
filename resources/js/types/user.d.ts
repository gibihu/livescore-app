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
    wallet: WalletType;
    retrieval_at?: string;
    rank: UserRankType;
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
    score: number;
    season: UserSeasonType;
    type: number;
    type_text: string;
    season_id: string;
    deleted_at: string;
    updated_at: string;
    created_at: string;
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
