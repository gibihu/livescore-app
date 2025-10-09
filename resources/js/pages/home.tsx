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

export default function Home(request: any) {
    const matches = request.matches as MatchType[];
    const leagues = request.leagues as CompetitionType[];
    const posts = request.posts as PostType[];

    console.log(request);

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <LiveScore match_items={matches} />
                {/* <span>{route('api.match.live')}</span> */}
                {/* <MatchDashboard /> */}
                {/* <FeedLive /> */}
            </div>
        </AppLayout>
    );
}
