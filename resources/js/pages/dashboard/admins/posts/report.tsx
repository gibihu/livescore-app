
import ReportTable from "@/components/dashboard/admins/posts/report-table";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { ReportType } from "@/types/post";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'รายการรายงาน',
        href: dash.admin.post.report.list().url,
    },
];

export default function Posts(request: any) {
    const reports = request.report as ReportType[];
    console.log(request);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
                <div className="flex flex-col gap-4 p-4">
                    <ReportTable items={reports} />
                </div>
        </AppLayout>
    )
}
