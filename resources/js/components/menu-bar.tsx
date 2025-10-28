import { Link, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import web from "@/routes/web";
import dash from "@/routes/dash";
import { AuthType } from "@/types/auth";
import { ButtonGroup } from "./ui/button-group";
import { ArchiveIcon, ArrowLeftIcon, CalendarPlusIcon, ClockIcon, ListFilterPlusIcon, MailCheckIcon, MoreHorizontalIcon, TagIcon, Trash2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function MenuBar() {
    const auth = usePage().props.auth as AuthType;
    return (
        <div className="w-full flex justify-end gap-2 flex-wrap">

            <ButtonGroup>
                <ButtonGroup>
                    {auth.user && (
                        <Button variant="outline" asChild>
                            <Link href={dash.post.create().url} prefetch>
                                สร้างทีเด็ด
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={web.post.all().url} prefetch>
                            ทีเด็ด
                        </Link>
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button variant="outline" asChild>
                        <Link href={web.match.live().url} prefetch>
                            ผลบอลสด
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={web.home().url} prefetch>
                            ตารางการแข่ง
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="More Options">
                                <MoreHorizontalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href={web.match.standings().url}>
                                        <ArchiveIcon />
                                        ตารางคะแนน
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            </ButtonGroup>
        </div>
    );
}

