// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน
// ห้ามลบ ใช้ component บางส่วน


import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Expand } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ShortName } from "@/lib/functions"
import { cn } from "@/lib/utils"
import { useEffect, useState, type ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchType, ScoreType } from "@/types/match"
import { Link, usePage } from "@inertiajs/react"
import MatchEvent from "./event"
import { Badge } from "@/components/customs/badge"
import TableMatch from "./table"
import dash from "@/routes/dash"
import { AuthType } from "@/types/auth"
import { UserType } from "@/types/user"

export function BoardScore({ items, isFetch = false }: { items: MatchType[], isFetch?: boolean }) {
    const auth = usePage().props.auth as AuthType;
    const user = auth.user as UserType;


    const [match, setmatch] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(isFetch);

    useEffect(() => {
        setmatch(items);
    }, [items]);
    useEffect(() => {
        setIsFetchBoard(isFetch);
    }, [isFetch]);


    const columns: ColumnDef<MatchType>[] = [
        {
            accessorKey: "home",
            header: () => (<div className="text-end">เจ้าบ้าน</div>),
            filterFn: (row, columnId, value) => {
                const homeTeamName = row.original.home?.name?.toLowerCase() || "";
                const awayTeamName = row.original.away?.name?.toLowerCase() || "";
                const searchValue = value?.toLowerCase() || "";

                return homeTeamName.includes(searchValue) || awayTeamName.includes(searchValue);
            },
            cell: ({ row }) => {
                const item = row.original.home;
                const momItem = row.original;
                return (
                    <TableCellViewer item={momItem} className="flex justify-between gap-2 items-center w-full h-full">
                        <MatchBadge item={momItem} home={true} />
                        <div className="flex gap-2">
                            {momItem.country?.id && (
                                <img
                                    src={`/flag?type=country&id=${momItem.country.id}`}
                                    className="h-3 w-5"
                                />
                            )}
                            <span className={cn("line-clamp-1 hidden md:block", whoWon(momItem.scores?.score || '?-?') == '1' ? 'text-success' : whoWon(momItem.scores?.score || '?-?') == '2' && 'text-red-700')}>{item.name}</span>
                            <span className={cn("line-clamp-1 md:hidden", whoWon(momItem.scores?.score || '?-?') == '1' ? 'text-success' : whoWon(momItem.scores?.score || '?-?') == '2' && 'text-red-700')}>{ShortName(item.name)}.</span>
                            <img src={item.logo} alt={item.logo} className="size-4" />
                        </div>
                    </TableCellViewer>
                );
            },
        },
        {
            accessorKey: "score",
            header: () => (<div className="text-center">คะแนน</div>),
            cell: ({ row }) => {
                const item = row.original.scores;
                const momItem = row.original;
                const odds = momItem.odds;
                return (
                    <TableCellViewer item={momItem} className="w-full h-full py-2">
                        <div className="flex flex-col justify-center items-center gap-2">
                            {odds?.pre?.[1] && odds.pre[2] && odds.pre['X'] && (
                                <div className="flex items-center justify-center gap-4">
                                    <span>{odds?.pre?.[1]}</span>
                                    <span>{odds?.pre?.['X']}</span>
                                    <span>{odds?.pre?.[2]}</span>
                                </div>
                            )}
                            <div className="flex">
                                <span className="text-xs  rounded-full  bg-foreground  text-background  px-2">{item?.score}</span>
                            </div>
                        </div>
                    </TableCellViewer>
                );
            },
        },
        {
            accessorKey: "away",
            header: "แขก",
            cell: ({ row }) => {
                const item = row.original.away;
                const momItem = row.original;
                return (
                    <TableCellViewer item={momItem} className="flex gap-2 justify-between items-center w-full h-full">
                        <div className="flex gap-2">
                            <img src={item.logo} alt={item.logo} className="size-4" />
                            <span className={cn("line-clamp-1 hidden md:block", whoWon(momItem.scores?.score || '?-?') == '2' ? 'text-success' : whoWon(momItem.scores?.score || '?-?') == '1' && 'text-red-700')}>{item.name}</span>
                            <span className={cn("line-clamp-1 md:hidden", whoWon(momItem.scores?.score || '?-?') == '2' ? 'text-success' : whoWon(momItem.scores?.score || '?-?') == '1' && 'text-red-700')}>{ShortName(item.name)}.</span>
                        </div>
                        <MatchBadge item={momItem} home={false} />
                    </TableCellViewer>
                );
            },
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: match,
        columns,
        enableColumnFilters: true, // เพิ่มบรรทัดนี้
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });


    return (
        <div className="w-full">
            <div className="flex items-center justify-between  py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("home")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("home")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex">
                    <Link href={"/match/history"}>
                        <Button>ประวัติ</Button>
                    </Link>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <TableMatch columns={columns} table={table} isFetchBoard={isFetchBoard} />
            </div>
            <div className="flex items-center justify-between px-4 my-4">
                <div className="text-muted-foreground hidden flex-1 text-sm md:flex">
                    {table.getFilteredRowModel().rows.length} รายการ
                </div>
                <div className="flex w-full items-center gap-8 md:w-fit">
                    <div className="hidden items-center gap-2 md:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            รายการต่อหน้า
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        หน้า {table.getState().pagination.pageIndex + 1} จาก{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TableCellViewer({ item, className, children, type }: { item: MatchType, className?: string, children?: ReactNode, type?: string}) {
    const auth = usePage().props.auth as AuthType;
    const [selectedTab, setSelectedTab] = useState("event");
    return (
        <Dialog>
            <DialogTrigger className={cn(className)}>{children}</DialogTrigger>
                <DialogContent className="[&>button]:hidden md:max-w-[90svw] md:max-h-[90vh] w-auto h-auto overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="w-full flex justify-end gap-2">
                                {auth && (
                                    <Link href={`${dash.post.create().url}?fixture_id=${item.fixture_id ?? item.id}`}>
                                        <Button asChild>
                                            <span>สร้างทีเด็ด</span>
                                        </Button>
                                    </Link>
                                )}
                                <Button>
                                    <Expand className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {item.country?.id && (
                                        <img
                                            src={`/flag?type=country&id=${item.country.id}`}
                                            className="h-3 w-5"
                                        />
                                    )}

                                    <span className="text-xs text-ring">{item.location}</span>
                                    {IsPlay(item.status) && (
                                        <span className="relative flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                                        </span>
                                    )}
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <div className="flex-1 flex flex-col gap-2 items-end">
                                        <div className="flex flex-col items-center gap-2">
                                            <img src={item.home.logo} alt={item.home.logo} className="size-12" />
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs uppercase cursor-default">{ShortName(item.home.name)}.</span>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    <p>{item.home.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <span>{item.scores?.score}</span>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2 items-start">
                                        <div className="flex flex-col items-center gap-2">
                                            <img src={item.away.logo} alt={item.away.logo} className="size-12" />
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs uppercase cursor-default">{ShortName(item.away.name)}.</span>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    <p>{item.away.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="mt-4 w-max" asChild>

                            <div>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full flex justify-center">

                                        {IsTime(item.time) ? "เวลา: " + item.time + ` น. (${matchStatus(item.status)})` : matchStatus(item.status)}

                                    </div>

                                    <div className="grid grid-cols-4 border rounded-xl p-2 py-4 divide-x  divide-border">

                                        <div className="flex flex-col justify-start text-center gap-2 px-2">
                                            <p className="font-bold text-sm">คะแนนครึ่งแรก</p>
                                            <span>{item.scores?.ht_score || "-"}</span>
                                        </div>
                                        <div className="flex flex-col justify-start text-center gap-2 px-2">
                                            <p className="font-bold text-sm">คะแนนครึ่งหลัง</p>
                                            <span>{item.scores?.ft_score || "-"}</span>
                                        </div>
                                        <div className="flex flex-col justify-start text-center gap-2 px-2">
                                            <p className="font-bold text-sm">คะแนนต่อเวลา</p>
                                            <span>{item.scores?.et_score || "-"}</span>
                                        </div>
                                        <div className="flex flex-col justify-start text-center gap-2 px-2">
                                            <p className="font-bold text-sm">จุดโทษ</p>
                                            <span>{item.scores?.ps_score || "-"}</span>
                                        </div>

                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Tabs defaultValue="event" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
                                            <TabsList>
                                                <TabsTrigger value="event">อีเว้น</TabsTrigger>
                                                <TabsTrigger value="player">ผู้เล่น</TabsTrigger>
                                            </TabsList>

                                            {/* Render ทั้งหมด แต่ซ่อนด้วย class */}
                                            <div className={selectedTab === "event" ? "block w-full" : "hidden w-full"}>
                                                <MatchEvent match_id={item.id} main_item={item} />
                                            </div>

                                            <div className={selectedTab === "player" ? "block w-full" : "hidden w-full"}>
                                                Change your password here.
                                            </div>
                                        </Tabs>

                                    </div>

                                </div>
                            </div>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
        </Dialog>
    )
}


function IsTime(time: string): boolean {
    return !["NS", "HT", "FT"].includes(time);
}
function IsPlay(status: string): boolean {
    return !["FINISHED", "NOT STARTED"].includes(status);
}

function matchStatus(status: string) {
    let text = '';
    switch (status) {
        case "NOT STARTED":
            text = "ยังไม่เริ่ม";
            break;
        case "IN PLAY":
            text = "ลงสนาม";
            break;
        case "ADDED TIME":
            text = "เพิ่มเวลา";
            break;
        case "HALF TIME BREAK":
            text = "พักครึ่งแรก";
            break;
        case "FINISHED":
            text = "จบแล้ว";
            break;
        default:
            text = "ไม่ทราบสถานะ";
    }


    return text;
}
function whoWon(score: string): string | null {
    const [homeScoreStr, awayScoreStr] = score.split(" - ").map(s => s.trim());

    // ถ้าเป็น ? หรือแปลงไม่ได้ ให้ return null
    if (homeScoreStr === "?" || awayScoreStr === "?") {
        return null;
    }

    const homeScore = parseInt(homeScoreStr);
    const awayScore = parseInt(awayScoreStr);

    if (isNaN(homeScore) || isNaN(awayScore)) {
        return null;
    }

    if (homeScore > awayScore) {
        return "1";
    } else if (homeScore < awayScore) {
        return "2";
    } else {
        return "x";
    }
}

function MatchBadge({ item, home = true }: { item: any, home: boolean }) {
    const status = item.status;
    const score = item.scores.score;
    if (status === "ADDED TIME") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "IN PLAY") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "HALF TIME BREAK") {
        return <Badge variant="outline">พัก</Badge>;
    } else if (status !== "FINISHED") {
        return <div></div>;
    }

    if (home) return whoWon(score) == "1" ? <Badge variant="success">ชนะ</Badge> : (whoWon(score) == "2" ? <Badge variant="destructive">แพ้</Badge> : <Badge variant="default">เสมอ</Badge>)
    return whoWon(score) == "2" ? <Badge variant="success">ชนะ</Badge> : (whoWon(score) == "1" ? <Badge variant="destructive">แพ้</Badge> : <Badge variant="default">เสมอ</Badge>)
}
function MatcTimehBadge({ item }: { item: MatchType }) {
    const status = item.status;
    if (status === "ADDED TIME") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "IN PLAY") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "HALF TIME BREAK") {
        return <Badge variant="outline">พัก</Badge>;
    } else {
        return '';
    }
}


export {
    IsPlay,
    IsTime, MatchBadge, matchStatus, TableCellViewer, whoWon, MatcTimehBadge
}

