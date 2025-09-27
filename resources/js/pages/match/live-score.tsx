
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardScore } from "./board-score";
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";


const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore() {
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [isloading, setIsloading] = useState(true);
    const [leagues, setLeagues] = useState<CompetitionType[]>([]);
    const [filters, setFilters] = useState<(CompetitionType & { matches: MatchType[] })[]>([]);
        const [posts, setPost] = useState<PostType[]>([]);

    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);
    const [isLeagueFetch, setIsLeagueFetch] = useState<boolean>(false);
    const [isPostfetch, setPostFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
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
            setIsMatchFetch(false);
        };
        fetchData();
        const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod() {
        const fetchData = async () => {
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
            setIsMatchFetch(false);
        };
        fetchData();
    }

    useEffect(() => {
        const fetchData = async () => {
            setPostFetch(true);
            try {
                const res = await fetch(api.post.feed().url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = await result.data;
                    console.log(data);
                    setPost(data);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                let message = "เกิดข้อผิดพลาดบางอย่าง";

                if (error instanceof Error) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                }

                toast.error(message);
            } finally {
                setPostFetch(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const ids = matches.map((item: MatchType) => item.competition?.id).join(",");
            setIsLeagueFetch(true);
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
            setIsLeagueFetch(false);
            setIsloading(false);
        };
        if(!isMatchFetch){
            fetchData();
        }
    }, [isMatchFetch]);


    useEffect(() => {
        if (posts && posts.length > 0) {
            const matchesWithPosts1: MatchType[] = matches.map(item => ({
                ...item,
                posts: posts.filter(post => post.ref_id === item.fixture_id)
            }));
            console.log(matchesWithPosts1);
            setMatches(matchesWithPosts1);
        }
    }, [isMatchFetch, posts])



    useEffect(() => {
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

            console.log(updatedFilters)

            setFilters(updatedFilters);
        }
    }, [matches, leagues]);


    return (
        <BoardTable items={filters} isFetch={isloading} />
    );
}
