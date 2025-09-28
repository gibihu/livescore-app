import { UserGuast } from './user';

export interface PackType {
    id: string,
    sort_no: number;
    points: number;
    price: number;
    price_per_point?: number;
    published?: number;
    is_promo: number;
    promo_title: string;
    note: string;
}

export interface TransactionType{
    id: string;
    user_id: string;
    package_id: string;
    user_reference?: string;
    reference_code?: string;
    payment_method: string;
    amount: number;
    points: number;
    rate?: number;
    currency?: string;
    type: number;
    type_text?: string;
    status: string;
    status_text?: string;
    slip_url?: string;
    paid_at?: string;
    approved_at: string;
    expired_at: string;
    updated_at: string;
    created_at: string;
    gateway?: string;
    gateway_txn_id?: string;
    raw_response?: string;
}


export interface WalletHistoryType {
    id: string;
    wallet_id: string;
    change_amount: number;
    role: number;
    role_text?: string;
    type: number;
    type_text?: string;
    user?: {
        id: string,
        name?: string,
        username: string,
        email: string,
    };
    description?: string;
    updated_at: string;
    created_at: string;
}

export interface WalletType {
    id: string;
    points: number;
    income: number;
    updated_at: string;
    created_at: string;
}


