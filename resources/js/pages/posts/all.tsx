import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { CompetitionType } from "@/types/league";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import { Head } from "@inertiajs/react";

export default function Home(request: any) {
    console.log(request);

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">

            </div>
        </AppLayout>
    );
}
