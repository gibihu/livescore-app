
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardTable } from "./board-table";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


export default function HistoryScore({request}:{request: any}) {
    console.log(request);
    const [matches, setMatches] = useState<MatchType[]>(request.matches as MatchType[]);
    const [filters, setFilters] = useState<FilteredMatchesType[]>([]);

    useEffect(() => {
        const updatedFilters = groupMatches(matches);
        setFilters(updatedFilters);
    }, []);

    return (
        // <BoardScore items={matches} isFetch={isFetchBoard} />
        <BoardTable items={filters} type="history" fixture_date={request.fixture_date} />
    );
}
