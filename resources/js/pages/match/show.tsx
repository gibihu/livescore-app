import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import web from "@/routes/web";
import { Card } from "@/components/ui/card";
import FeedLive from "../feeds/live-feed";

export default function ShowMatch(request: any) {
    const match = request.match.json as MatchType;

    console.log(match);

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">

                <div className="flex justify-center items-center gap-4">

                    <div className="flex flex-col gap-2">
                        <img src={match.home.logo} alt={match.home.logo} className="size-24" />
                    </div>
                    <span>{match.scores?.score}</span>
                    <div className="flex flex-col gap-2">
                        <img src={match.away.logo} alt={match.away.logo} className="size-24" />
                    </div>

                </div>

                <div className="flex flex-col gap-2">
                    <FeedLive />
                </div>

            </div>
        </AppLayout>
    );
}
