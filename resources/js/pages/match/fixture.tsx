
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import type { MatchType } from "@/types/match";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


export default function FixtureScore({ request, items }: { request: any, items: any }) {
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [filters, setFilters] = useState<FilteredMatchesType[]>([]);

    useEffect(()=>{
        setMatches(items as MatchType[]);
    },[items]);

    const [isFetchBoard, setIsFetchBoard] = useState(false);


    const groupedMatches = useMemo(() => {
        const groups: Record<string, { league: any; country: any; matches: any[] }> = {};

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
        return Object.values(groups);
    }, [matches]);


    return (
        // <BoardScore items={matches} isFetch={isFetchBoard} />
        <BoardTable items={groupedMatches} isFetch={isFetchBoard} request={request} type="fixture" />
    );
}
