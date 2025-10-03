import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/layout";
import web from "@/routes/web";
import { Head, Link } from "@inertiajs/react";
import FixtureScore from "./match/fixture";
import MenuBar from "@/components/menu-bar";

export default function Home(request: any) {
    return (
        <AppLayout>
            <Head title="ตารางการแข่งขัน" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <FixtureScore request={request} />
            </div>
        </AppLayout>
    );
}
