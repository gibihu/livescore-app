
import api from "@/routes/api";
import { CompetitionType } from "@/types/league";
import type { MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardTable } from "./board-table";
import { PostType } from "@/types/post";


export default function FixtureScore() {
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [leagues, setLeagues] = useState<CompetitionType[]>([]);
    const [filters, setFilters] = useState<(CompetitionType & { matches: MatchType[] })[]>([]);
    const [posts, setPost] = useState<PostType[]>([]);

    const [isFetchBoard, setIsFetchBoard] = useState(false);
    const [isMatchFetch, setIsMatchFetch] = useState<boolean>(true);
    const [isPostfetch, setPostFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchBoard(true);
            setIsMatchFetch(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${api.match.fixture().url}`);

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
    }, []);


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
        if (!isMatchFetch) {
            fetchData();
        }
    }, [isMatchFetch]);



    useEffect(() => {
        if (posts && posts.length > 0) {
            const matchesWithPosts1: MatchType[] = matches.map(item => ({
                ...item,
                posts: posts.filter(post => post.ref_id === item.id)
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
        // <BoardScore items={matches} isFetch={isFetchBoard} />
        <BoardTable items={filters} isFetch={isFetchBoard} type="fixture" />
    );
}
