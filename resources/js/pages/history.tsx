import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import FeedLive from "./feeds/live-feed";
import { Button } from "@/components/ui/button";
import HistoryScore from "./match/historyMatch";
import web from "@/routes/web";

export default function History() {

    return (
        <AppLayout>
            <Head title="ประวัติ" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <div className="w-full flex justify-end gap-2">
                    <Link href={web.match.fixture().url}>
                        <Button asChild>
                            <span>ตารางการแข่ง</span>
                        </Button>
                    </Link>
                    <Link href={web.home().url}>
                        <Button asChild>
                            <span>ตารางสด</span>
                        </Button>
                    </Link>
                </div>
                <HistoryScore />
            </div>
        </AppLayout>
    );
}
