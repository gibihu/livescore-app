import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import FeedLive from "./feeds/live-feed";
import match from "@/routes/match";
import { Button } from "@/components/ui/button";
import HistoryScore from "./match/historyMatch";

export default function History() {

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <HistoryScore />
            </div>
        </AppLayout>
    );
}
