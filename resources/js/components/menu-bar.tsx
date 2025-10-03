import { Link } from "@inertiajs/react";
import { Button } from "./ui/button";
import web from "@/routes/web";

export default function MenuBar() {
    return (
        <div className="w-full flex justify-end gap-2">
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
