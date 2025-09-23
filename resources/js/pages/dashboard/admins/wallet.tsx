

import WalletTable from "@/components/dashboard/admins/wallet-table";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ประวัติการเติมพอยต์',
        href: dash.admin.wallet.table().url,
    },
];
export default function Wallet() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
                <div className="flex flex-col gap-4 p-4">
                    <WalletTable />
                </div>
        </AppLayout>
    )
}
