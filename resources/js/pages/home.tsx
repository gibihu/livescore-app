import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import { Button } from "@/components/ui/button";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import web from "@/routes/web";

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
                <div className="w-full flex justify-end gap-2">
                    <Link href={web.match.fixture().url}>
                        <Button asChild>
                            <span>ตารางการแข่ง</span>
                        </Button>
                    </Link>
                    <Link href={web.match.history().url}>
                        <Button asChild>
                            <span>ประวัติ</span>
                        </Button>
                    </Link>
                </div>
                <LiveScore match_items={matches} leagues_items={leagues} posts_items={posts} />
                {/* <span>{route('api.match.live')}</span> */}
                {/* <MatchDashboard /> */}
                {/* <FeedLive /> */}
            </div>
        </AppLayout>
    );
}
