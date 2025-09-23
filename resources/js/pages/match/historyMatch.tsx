import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
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
} from "@/components/ui/table"
import { ShortName } from "@/lib/functions"
import type { MatchType } from "@/types/match"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/routes/api"
import { MatchBadge, TableCellViewer, whoWon } from "./board-score"
import { cn } from "@/lib/utils"

const API_URL: string = import.meta.env.VITE_API_URL;
export default function HistoryScore() {
    const [match, setmatch] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(false);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchBoard(true);
            const res = await fetch(`${api.match.history().url}?page=${page}`);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                toast.error(result.message);
            }
            setIsFetchBoard(false);
        };
        fetchData();
        // const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        // return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod() {
        const fetchData = async () => {
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${API_URL}/live/live_score`, { credentials: "include" });

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
        };
        fetchData();
    }



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
                            <span className={cn("line-clamp-1 hidden md:block", whoWon(momItem.scores.score) == '1' ? 'text-success' : whoWon(momItem.scores.score) == '2' && 'text-red-700')}>{item.name}</span>
                            <span className={cn("line-clamp-1 md:hidden", whoWon(momItem.scores.score) == '1' ? 'text-success' : whoWon(momItem.scores.score) == '2' && 'text-red-700')}>{ShortName(item.name)}.</span>
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
                                <span className="text-xs  rounded-full  bg-foreground  text-background  px-2">{item.score}</span>
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
                            <span className={cn("line-clamp-1 hidden md:block", whoWon(momItem.scores.score) == '2' ? 'text-success' : whoWon(momItem.scores.score) == '1' && 'text-red-700')}>{item.name}</span>
                            <span className={cn("line-clamp-1 md:hidden", whoWon(momItem.scores.score) == '2' ? 'text-success' : whoWon(momItem.scores.score) == '1' && 'text-red-700')}>{ShortName(item.name)}.</span>
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
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed bg-card">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className={header.id === 'score' ? 'w-30' : ''}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!isFetchBoard ? (
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="p-0 px-2 h-10">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        ยังไม่มีการแข่งขัน
                                    </TableCell>
                                </TableRow>
                            )
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    กำลังโหลด...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

