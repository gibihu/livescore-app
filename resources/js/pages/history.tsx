import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import FeedLive from "./feeds/live-feed";
import { Button } from "@/components/ui/button";
import HistoryScore from "./match/historyMatch";
import web from "@/routes/web";
import MenuBar from "@/components/menu-bar";

export default function History() {

    return (
        <AppLayout>
            <Head title="ประวัติ" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <HistoryScore />
            </div>
        </AppLayout>
    );
}
