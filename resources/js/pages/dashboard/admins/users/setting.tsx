import UserFrom from "@/components/dashboard/admins/users/user-form";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [];


export default function UserShow(request: any) {
    console.log(request);
    const newCrumb = {
        title: "ตั้งค่าผู้ใช้",
        href: dash.admin.users.setting(request.user.id).url,
    };

    // ตรวจสอบว่ามี breadcrumb นี้อยู่แล้วหรือยัง
    const exists = breadcrumbs.some(
        crumb => crumb.href === newCrumb.href || crumb.title === newCrumb.title
    );

    if (!exists) {
        breadcrumbs.push(newCrumb);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">
                <UserFrom request={request} />
            </div>
        </AppLayout>
    );
}
