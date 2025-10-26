"use client"

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Settings } from "lucide-react"
import * as React from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
import { toast } from "sonner"
import { UserType } from "@/types/user"
import { AuthType } from "@/types/auth"
import { Link, usePage } from "@inertiajs/react"
import api from "@/routes/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import dash from "@/routes/dash"



export function UserTable({ request }: { request: any }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const auth = usePage().props.auth as AuthType;
    const user = auth.user as UserType;
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [users, setUsers] = React.useState<UserType[]>(request.users ?? [] as UserType[]);

    console.log(request);



    const [isFetch, setIsFetch] = React.useState<boolean>(false);
    const handdleUpdateRole = (id: string, role: string) => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.admin.users.update().url, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken ?? ''
                    },
                    body: JSON.stringify({
                        role: role,
                        id: id
                    })
                });

                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    setUsers(prev =>
                        prev.map(user =>
                            user.id === id ? { ...user, role_text: role } : user
                        )
                    );
                } else {
                    const errors = await res.json();
                    toast.error(errors.message, { description: errors.code || '' });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }
        fetchData();
    };


    function handleUpdateTier(id: string, tier: string) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.admin.users.tier.update({ user_id: id }).url, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken ?? ''
                    },
                    body: JSON.stringify({
                        tier: tier,
                        id: id
                    })
                })
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setUsers(prev =>
                        prev.map(user =>
                            user.id === id ? { ...user, tier_text: data.tier_text } : user
                        )
                    );
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                let message = "เกิดข้อผิดพลาดบางอย่าง";
                if (error instanceof Error) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                }
                toast.error(message);
            } finally {
                setIsFetch(false);
            }
        }
        fetchData();
    }




    const createColumns = (handdleUpdateRole: (id: string, roel: string) => void, handleUpdateTier: (id: string, tier: string) => void, isFetch: () => boolean): ColumnDef<any>[] => [
        {
            accessorKey: "no",
            header: (() => (null)),
            cell: () => (null),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("username")}</div>
            ),
        },
        {
            accessorKey: "custom_rate",
            header: "ตั่งค่าเรท",
            cell: ({ row }) => {
                const rate = row.original.custom_rate;
                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="pl-0">+{rate}%</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )
            },
        },
        {
            accessorKey: "tier_text",
            header: "Tier",
            cell: ({ row }) => {
                const rank = row.original.rank;
                return (
                    <div className="capitalize">{rank.level_text}</div>
                );
            },
        },
        {
            accessorKey: "point",
            header: () => (
                <div className="w-full text-center">Point</div>
            ),
            cell: ({ row }) => (
                <div className="capitalize text-center">{Number(row.original.wallet.points).toLocaleString()}</div>
            ),
        },
        {
            accessorKey: "actions",
            header: '',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2 flex-wrap justify-end">
                        <Link href={dash.admin.users.setting({ id: item.id }).url}>
                            <Button variant="ghost">
                                <Settings />
                            </Button>
                        </Link>
                    </div>
                )
            },
        },
    ]



    const columns = createColumns(handdleUpdateRole, handleUpdateTier, () => isFetch);


    const table = useReactTable({
        data: users,
        columns,
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
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter username..."
                    value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("username")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
