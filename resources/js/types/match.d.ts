

export interface MatchType {
    location?: string;
    scheduled?: string;
    country: CountryType;
    last_changed?: string;
    status: string;
    fixture_id?: number | null;
    home: HomeType;
    away: AwayType;
    id: number;
    federation?: string | null;
    odds?: {
        live?: string[];
        pre?: {
            '1': number;
            '2': number;
            'X': number;
        };
    };
    time: string;
    added?: string;
    competition?: CompetitionType;
    outcomes?: {
        half_time?: string;
        full_time?: string;
        extra_time?: string | null;
        penalty_shootout?: string | null;
    };
    scores: ScoreType;
    urls?: {
        events?: string;
        statistics?: string;
        lineups?: string;
        head2head?: string;
    }
}

export interface ScoreType {
    score: string;
    ht_score?: string | null;
    ft_score?: string | null;
    et_score?: string | null;
    ps_score?: string | null;
}

export interface HomeType {
    logo: string;
    id: number;
    name: string;
    country_id: number;
    stadium: string;
}

export interface AwayType {
    logo: string;
    id: number;
    name: string;
    country_id: number;
    stadium: string;
}

export interface CountryType {
    flag: string;
    name: string;
    id: number | null;
    uefa_code: string;
    fifa_code: string;
    is_real: boolean;
}

export interface CompetitionType {
    is_cup: boolean;
    active: boolean;
    has_groups: boolean;
    national_teams_only: boolean;
    tier: number;
    name: string;
    is_league: boolean;
    id: number;
}

