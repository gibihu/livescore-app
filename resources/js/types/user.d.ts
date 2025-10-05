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
}


export interface UserGuast {
    id: string;
    avatar?: string
    name: string;
    username: string;
    tier_text: string;
}
