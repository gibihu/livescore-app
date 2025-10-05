
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


export default function FixtureScore({request}:{request: any}) {
    console.log(request);
    const [matches, setMatches] = useState<MatchType[]>(request.matches as MatchType[]);
    const [filters, setFilters] = useState<FilteredMatchesType[]>([]);

    const [isFetchBoard, setIsFetchBoard] = useState(false);



    useEffect(() => {
        const updatedFilters = groupMatches(matches);
        setFilters(updatedFilters);
    }, []);




    return (
        // <BoardScore items={matches} isFetch={isFetchBoard} />
        <BoardTable items={filters} isFetch={isFetchBoard} type="fixture" fixture_date={request.fixture_date} />
    );
}
