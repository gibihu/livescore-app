import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/layout";
import web from "@/routes/web";
import { Head, Link } from "@inertiajs/react";
import FixtureScore from "./match/fixture";

export default function Home() {
    return (
        <AppLayout>
            <Head title="ตารางการแข่งขัน" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <div className="w-full flex justify-end gap-2">
                    <Link href={web.home().url}>
                        <Button asChild>
                            <span>ตารางสด</span>
                        </Button>
                    </Link>
                    <Link href={web.match.history().url}>
                        <Button asChild>
                            <span>ประวัติ</span>
                        </Button>
                    </Link>
                </div>
                <FixtureScore />
            </div>
        </AppLayout>
    );
}
