import { Link, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import web from "@/routes/web";
import dash from "@/routes/dash";
import { AuthType } from "@/types/auth";

export default function MenuBar() {
    const auth = usePage().props.auth as AuthType;
    return (
        <div className="w-full flex justify-end gap-2">
            {auth.user && (
                <Link href={dash.post.create().url} prefetch>
                    <Button asChild>
                        <span>สร้างทีเด็ด</span>
                    </Button>
                </Link>
            )}
            <Link href={web.post.all().url} prefetch>
                <Button asChild>
                    <span>ทีเด็ด</span>
                </Button>
            </Link>
            <Link href={web.home().url} prefetch>
                <Button asChild>
                    <span>ตารางสด</span>
                </Button>
            </Link>
            <Link href={web.match.fixture().url} prefetch>
                <Button asChild>
                    <span>ตารางการแข่ง</span>
                </Button>
            </Link>
            <Link href={web.match.history().url} prefetch>
                <Button asChild>
                    <span>ประวัติ</span>
                </Button>
            </Link>
        </div>
    );
}
