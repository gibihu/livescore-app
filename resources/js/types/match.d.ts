import { PostType } from './post'

export interface MatchType {
    location?: string;
    scheduled?: string;
    country: CountryType;
    last_changed?: string;
    status: string;
    fixture_id?: number | null;
    home_team_id: string;
    home: TeamType;
    away: TeamType;
    away_team_id: string;
    id: string;
    match_id?: number | null;
    federation?: {
        id: string;
        federation_id: number;
        name: string;
        name_th: string;
        updated_at: string;
        created_at: string;
    };
    odds?: {
        live?: string[];
        pre?: {
            '1': number | null;
            '2': number | null;
            'X': number | null;
        };
    };
    time: string;
    date?: string;
    date_th?: string;
    date_th_short?: string;
    added?: string;
    added_th?: string;
    added_th_short?: string;
    league?: CompetitionType;
    competition_id: string;
    outcomes?: {
        half_time?: string;
        full_time?: string;
        extra_time?: string | null;
        penalty_shootout?: string | null;
    };
    scores?: ScoreType;
    urls?: {
        events?: string;
        statistics?: string;
        lineups?: string;
        head2head?: string;
    };
    posts?: PostType[];
    live_status: string;
}

export interface ScoreType {
    score: string;
    ht_score?: string | null;
    ft_score?: string | null;
    et_score?: string | null;
    ps_score?: string | null;
}

export interface TeamType {
    logo: string;
    id: string;
    team_id: number;
    name: string;
    country_id: number;
    stadium: string;
    country_id?: string
    created_at?: string
}


export interface CountryType {
    flag: string;
    name: string;
    id: string;
    country_id: number | null;
    uefa_code: string;
    fifa_code: string;
    is_real: boolean;
}

interface CompetitionType {
    id: string;
    competition_id: number;
    is_cup: boolean;
    active: boolean;
    has_groups: boolean;
    national_teams_only: boolean;
    tier: number;
    name: string;
    is_league: boolean;
}

export interface OddsType{
    1: number;
    2: number;
    X: number;
}


export interface StageType{
    id: string;
    name: string;
    competition: CompetitionType,
    competition_id: string;
    group: GroupType;
    group_id: string;
    season: SeasonType;


    deleted_at: string;
    updated_at: string;
    created_at: string;
}


export interface GroupType {
    id: string;
    group_id: number;
    name: string;
    standings_id: string[];
    standing: StandingType[];
    deleted_at: string;
    updated_at: string;
    created_at: string;
}


export interface SeasonType {
    id: string;
    name: string;
    name_th: string;
    season_id: number;
    start: string;
    end: string;
    updated_at: string;
    created_at: string;
}

export interface StandingType{
    id: string;
    drawn: number;
    goal_diff: number;
    goals_conceded: number;
    goals_scored: number;
    lost: number;
    matches: number;
    points: number;
    won: number;
    rank: number;
    team_id: string;
    team: TeamType;

    deleted_at: string;
    updated_at: string;
    created_at: string;
}
