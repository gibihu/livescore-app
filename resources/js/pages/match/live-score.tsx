
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardScore } from "./board-score";
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import { BoardTable } from "./board-table";


const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore() {
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(false);
    const [leagues, setLeagues] = useState<CompetitionType[]>([]);
    const [filters, setFilters] = useState<(CompetitionType & { matches: MatchType[] })[]>([]);

    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchBoard(true);
            setIsMatchFetch(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data;
                setMatches(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsFetchBoard(false);
            setIsMatchFetch(false);
        };
        fetchData();
        const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const ids = matches.map((item: MatchType) => item.competition?.id).join(",");
            setIsFetchBoard(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${api.league.all().url}?filter_ids=${ids}`);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data;
                setLeagues(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsFetchBoard(false);
        };
        if(!isMatchFetch){
            fetchData();
        }
    }, [matches]);

    function hanffleRelod() {
        const fetchData = async () => {
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data;
                setMatches(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
        };
        fetchData();
    }

    useEffect(() => {
        // แสดง leagues เสมอ แม้ว่า matches จะยังไม่มีข้อมูล
        if (leagues && leagues.length > 0) {
            const updatedFilters = leagues.map((league: CompetitionType) => {
                // หา matches ที่เป็นของ league นี้
                const leagueMatches = (matches || []).filter(
                    (match) => match.competition && match.competition.id === league.id
                );
                return {
                    ...league,
                    matches: leagueMatches, // จะเป็น array ว่างถ้าไม่มี matches
                };
            });

            setFilters(updatedFilters);
        }
    }, [matches, leagues]);

    useEffect(() => {
        setTimeout(() => {
            console.log(filters);
        }, 1000);
    });

    return (
        // <BoardScore items={matches} isFetch={isFetchBoard} />
        <BoardTable items={filters} isFetch={isFetchBoard} />
    );
}
