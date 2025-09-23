

import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { UserTable } from "../../../components/dashboard/admins/user-table";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'รายชื่อผู้ใช้',
        href: dash.admin.users.table().url,
    },
];
export default function UsersDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
                <div className="flex flex-col gap-4 p-4">
                    <UserTable />
                </div>
        </AppLayout>
    )
}
