
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import type { MatchType } from "@/types/match";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


export default function FixtureScore({request}:{request: any}) {
    console.log(request);
    const [matches, setMatches] = useState<MatchType[]>(request.matches as MatchType[]);
    const [filters, setFilters] = useState<FilteredMatchesType[]>([]);

    const [isFetchBoard, setIsFetchBoard] = useState(false);




        const groupedMatches = useMemo(() => {
            const groups: Record<string, { name: string; matches: any[] }> = {};

            matches.forEach((match: any) => {
                const leagueId = match.league?.id;
                const leagueName = match.league?.name;

                if (!leagueId) return; // เผื่อบาง match ไม่มี league

                if (!groups[leagueId]) {
                    groups[leagueId] = {
                        name: leagueName,
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
        <BoardTable items={groupedMatches} isFetch={isFetchBoard} type="fixture"/>
    );
}
