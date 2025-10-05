
import UserHistoryPaymentTable from "@/components/dashboard/admins/history-trans-table";
import UserPaymentTable from "@/components/dashboard/admins/transaction-table";
import WalletTable from "@/components/dashboard/admins/wallet-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

export default function UserPaymentPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'พอยต์',
            href: dash.admin.users.table().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">
                <Tabs defaultValue="transaction">
                    <div className="flex gap-4">
                        <TabsList>
                            <TabsTrigger value="transaction">รายการเติมพอยต์</TabsTrigger>
                            <TabsTrigger value="transaction_history">ประวัติรายการ</TabsTrigger>
                        </TabsList>
                        <TabsList>
                            <TabsTrigger value="history">ประวัติการเติม</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="transaction">
                        <UserPaymentTable />
                    </TabsContent>
                    <TabsContent value="transaction_history">
                        <UserHistoryPaymentTable />
                    </TabsContent>

                    <TabsContent value="history">
                        <WalletTable />
                    </TabsContent>

                </Tabs>
            </div>
        </AppLayout>
    );
}
