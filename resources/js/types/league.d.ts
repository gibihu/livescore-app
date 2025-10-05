import { MatchType } from './match';

export interface SessionType {
    id: number;
    name: string;
    start: string; // ISO Date string
    end: string; // ISO Date string
    created_at: string;
    updated_at: string;
}

export interface CountryType {
    id: number;
    name: string;
    flag: string;
    fifa_code: string;
    uefa_code: string;
    is_real: number;
    created_at: string;
    updated_at: string;
}

export interface FederationsType {
    id: number;
    name: string;
}

export interface CompetitionType {
    id: string;
    competition_id: number;
    name: string;
    is_league: number;
    is_cup: number;
    tier: number;
    has_groups: number;
    active: number;
    national_teams_only: number;
    country_id: number;
    season_id: number;
    federation_id: number;
    created_at: string;
    updated_at: string;
    session: Session;
    federations: any[]; // You can define an interface for federation if needed
    countries: Country[];
    matches?: MatchType[];
}
