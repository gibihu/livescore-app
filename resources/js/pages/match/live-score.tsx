
import type { MatchType } from "@/types/match";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BoardScore } from "./board-score";
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore({ match_items }: { match_items: MatchType[] }) {
    const [matches, setMatches] = useState<MatchType[]>(match_items);

    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);
    const [isLeagueFetch, setIsLeagueFetch] = useState<boolean>(false);
    const [isPostfetch, setPostFetch] = useState<boolean>(false);

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


    console.log(groupedMatches);

    return (
        <BoardTable items={groupedMatches} isFetch={false} />
    );
}
