
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardScore } from "./board-score";
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";
import { FilteredMatchesType, groupMatches } from "@/lib/functions";


const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore({match_items}:{match_items: MatchType[]}) {
    const [matches, setMatches] = useState<MatchType[]>(match_items);
    const [filters, setFilters] = useState<FilteredMatchesType[]>([]);

    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);
    const [isLeagueFetch, setIsLeagueFetch] = useState<boolean>(false);
    const [isPostfetch, setPostFetch] = useState<boolean>(false);

    const [restep, setRestep] = useState<number>(1);

    useEffect(() => {
        setRestep(2);
        const intervalId = setInterval(hanffleRelod, 61000);

        // // ล้าง interval เมื่อ component ถูก unmount
        return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod() {
        const fetchData = async () => {
            setIsMatchFetch(true);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            if (result.code == 200) {
                const data = await result.data;
                setMatches(data);
                setRestep(2);
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsMatchFetch(false);
        };
        if(restep == 1){
            fetchData();
        }
    }

    useEffect(() => {
        if (restep == 2 && matches.length > 0) {
            const updatedFilters = groupMatches(matches);

            console.log(updatedFilters)

            setFilters(updatedFilters);
            setRestep(1);
        }
    }, [restep]);


    return (
        <BoardTable items={filters} isFetch={false} />
    );
}
