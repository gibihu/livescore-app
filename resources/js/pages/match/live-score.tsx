
import type { MatchType } from "@/types/match";
import { useEffect, useMemo, useState } from "react";
import { BoardTable } from "./board-table";

interface FilterType {
    league: any;
    country: any;
    matches: MatchType[]
}

const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore({ match_items, isFetch }: { match_items: MatchType[], isFetch?: boolean }) {
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);
    const [isLeagueFetch, setIsLeagueFetch] = useState<boolean>(false);
    const [isPostfetch, setPostFetch] = useState<boolean>(false);
    const [filtered, setFiltered] = useState<FilterType[]>();

    useEffect(() => {
        setMatches(match_items);
    }, [match_items]);


    const groupedMatches = useMemo(() => {
        const groups: Record<string, FilterType> = {};

        matches.forEach((match: any) => {
            const leagueId = match.league?.id;
            const leagueName = match.league;
            const country = match.country;

            if (!leagueId) return; // เผื่อบาง match ไม่มี league

            if (!groups[leagueId]) {
                groups[leagueId] = {
                    league: leagueName,
                    country: country,
                    matches: [],
                };
            }

            groups[leagueId].matches.push(match);
        });

        // แปลง object → array [{ name, matches }]
        setFiltered(Object.values(groups));
    }, [matches]);

    return (
        <BoardTable items={filtered} isFetch={isFetch} />
    );
}
