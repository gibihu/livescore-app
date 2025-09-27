import { OddsType } from './match';

export interface PostType {
    id: string;
    user_id: string;
    ref_id?: number;
    user: UserGuast;
    title: string;
    title_short?: string;
    contents: string;
    points: number;
    privacy: number;
    odds: OddsType[];
    score: string;
    privacy_text: string;
    updated_at: string;
    created_at: string;
}
