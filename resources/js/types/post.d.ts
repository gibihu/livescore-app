import { MatchType, OddsType } from './match';
import { UserGuast } from './user';

export interface PostType {
    id: string;
    user_id: string;
    ref_id: string;
    ref_type: number;
    ref_type_text: string;
    title: string;
    points: number;
    negotiate: string;
    hl_expected: boolean;
    hl_negotiate: string;
    hl_description: string;
    eod_expected: boolean;
    eod_description: string;
    oxt_expected: [number, number, number]; // 1 x 2
    oxt_description: string;
    type: number;
    type_text: string;
    privacy: number;
    privacy_text: string;
    status: number;
    status_text: string;
    user: UserGuast;
    match: MatchType;
}
