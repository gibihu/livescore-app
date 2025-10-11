import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head } from "@inertiajs/react";
import HistoryScore from "../match/historyMatch";


export default function View(request: any) {
    console.log(request);

    return (
        <AppLayout>
            <Head title="ประวัติ" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                {request.user.name}
                <span> | </span>
                {request.user.username}
            </div>
        </AppLayout>
    );
}
