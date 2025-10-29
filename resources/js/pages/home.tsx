import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import { Button } from "@/components/ui/button";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import web from "@/routes/web";
import MenuBar from "@/components/menu-bar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Home(request: any) {
    const matches = request.matches as MatchType[];
    const leagues = request.leagues as CompetitionType[];
    const posts = request.posts as PostType[];

    const [input, setInput] = useState<string>("");
    const [filteredMatches, setFilteredMatches] = useState<MatchType[]>(matches);

    useEffect(() => {
        const keyword = input?.trim();

        if (!keyword) {
            setFilteredMatches(matches);
            return;
        }

        // ทำให้ค้นหาไม่สนตัวพิมพ์เล็กใหญ่ และรองรับภาษาไทย
        const lower = keyword.toLowerCase();

        const result = matches.filter((m) => {
            const home = m.home.name?.toLowerCase() || "";
            const away = m.away.name?.toLowerCase() || "";

            return home.includes(lower) || away.includes(lower);
        });

        setFilteredMatches(result);

    }, [input, matches]);

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar>
                    <Input
                        className="max-w-full sm:max-w-xs"
                        placeholder="ค้นหาทีม"
                        onChange={e => setInput(e.target.value)}
                    />
                </MenuBar>
                <LiveScore match_items={filteredMatches} />
            </div>
        </AppLayout>
    );
}
