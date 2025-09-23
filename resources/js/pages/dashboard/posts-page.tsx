
import { PostTable } from "@/components/dashboard/posts-table";
import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ทีเด็ด',
        href: dash.post.index().url,
    },
];

export default function PostsPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
                <div className="flex flex-col gap-4 p-4">
                    <PostTable />
                </div>
        </AppLayout>
    )
}
