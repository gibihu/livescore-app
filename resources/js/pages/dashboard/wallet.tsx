import { AppSidebar } from "@/components/app-sidebar";
import { WallerChart } from "@/components/dashboard/waller-chart";
import WalletHistoryTable from "@/components/dashboard/wallet-history-table";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'กระเป๋า',
        href: dash.wallet().url,
    },
];

export default function WalletPage(request: any) {
    console.log(request);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4 p-4">

                <div className="w-full px-4 lg:px-0 lg:w-110">
                    <WallerChart request={request} />
                </div>

                <div className="flex flex-col gpa-4 w-full px-4 lg:px-0">
                    <WalletHistoryTable request={request} />
                </div>

            </div>
        </AppLayout>
    );
}
