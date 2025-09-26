import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { LiveScore } from "./match/live-score";
import FeedLive from "./feeds/live-feed";
import match from "@/routes/match";
import { Button } from "@/components/ui/button";

export default function Home() {

    // const {  } = usePage();

    const auth = usePage().props.auth;
    console.log(auth);
    // console.log(usePage().props.auth.user);


    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <div className="w-full flex justify-end">
                    <Link href={match.history().url}>
                        <Button asChild>
                            <span>ประวัติ</span>
                        </Button>
                    </Link>
                </div>
                <LiveScore />
                {/* <span>{route('api.match.live')}</span> */}
                {/* <MatchDashboard /> */}
                <FeedLive />
            </div>
        </AppLayout>
    );
}
