
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardScore } from "./board-score";
import api from "@/routes/api";


const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore() {
    const [match, setmatch] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchBoard(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsFetchBoard(false);
        };
        fetchData();
        // const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        // return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod() {
        const fetchData = async () => {
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
        };
        fetchData();
    }

    return (
        <BoardScore items={match} isFetch={isFetchBoard} />
    );
}
