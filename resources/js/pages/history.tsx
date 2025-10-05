import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head } from "@inertiajs/react";
import HistoryScore from "./match/historyMatch";

export default function History(request: any) {

    return (
        <AppLayout>
            <Head title="ประวัติ" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <HistoryScore request={request} />
            </div>
        </AppLayout>
    );
}
