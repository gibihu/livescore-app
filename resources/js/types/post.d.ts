import { MatchType, OddsType } from './match';
import { UserGuast } from './user';

export interface PostType {
    id: string;
    user_id: string;
    ref_id: string;
    ref_type: number;
    ref_type_text: string;
    title: string;
    title_short: string;
    points: number;
    description: string;

    // negotiate: string;
    // hl_expected: boolean;
    // hl_negotiate: string;
    // hl_description: string;
    // eod_expected: boolean;
    // eod_description: string;
    // oxt_expected: [number, number, number]; // 1 x 2
    // oxt_description: string;
    show: ValueType;
    hidden: ValueType;
    hiddens: MainValueObjectType;

    type: number;
    type_text: string;
    privacy: number;
    privacy_text: string;
    status: number;
    status_text: string;
    user: UserGuast;
    match: MatchType;
    result: number;
    result_text: string;
    summary_at: string;
}


interface ValueType {
    value_1: string;
    value_2: string;
    value_3: string;
    value_4: string;
    value_5: string;
    value_6: string;
}
interface MainValueObjectType {
    value_1: ValueObjectType;
    value_2: ValueObjectType;
    value_3: ValueObjectType;
    value_4: ValueObjectType;
    value_5: ValueObjectType;
    value_6: ValueObjectType;
}

interface ValueObjectType{
    error: string;
    message?: string;
    title: string;
    value: number;
}
