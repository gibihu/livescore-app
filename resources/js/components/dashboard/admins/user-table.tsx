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
import { ArrowUpDown, ChevronDown } from "lucide-react"
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
import { usePage } from "@inertiajs/react"
import api from "@/routes/api"



export function UserTable() {
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
    const [users, setUsers] = React.useState<UserType[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(api.dash.admin.users.table().url);
            const result: any = await res.json();
            if (result.code == 200) {
                const data = result.data;
                setUsers(data || []);
            } else {
                toast.error(result.message, { description: 'code: ' + result.code || '' });
            }
        }
        fetchData();
    }, []);


    const [isFetch, setIsFetch] = React.useState<boolean>(false);
    const handdleUpdateRole = ( id: string, role: string ) => {
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
    }




    const createColumns = (handdleUpdateRole: (id: string, roel:string) => void, isFetch: () => boolean): ColumnDef<any>[] => [
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
            accessorKey: "tier_text",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tier
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("tier_text")}</div>,
        },
        {
            accessorKey: "point",
            header: "Point",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.wallet.points}</div>
            ),
        },
        {
            accessorKey: "status_text",
            header: (() => (
                <p className="text-end pe-2">สถาณะ</p>
            )),
            cell: ({ row }) => {
                const [value, setValue] = React.useState<string>(row.original.role_text);
                const [isOpen, setIsOpen] = React.useState<boolean>(false);
                // const [i, setI] = React.useState<string>();



                return (
                    <div className="flex justify-end">
                        <Label htmlFor={`${row.original.id}`} className="sr-only">
                            สถาณะ
                        </Label>
                        <Select defaultValue={value} value={value} onValueChange={(val)=>{
                            setIsOpen(true);
                            setValue(val);
                            }} disabled={isFetch()}>
                            <SelectTrigger
                                className="w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                                id={`${row.original.id}`}
                            >
                                <SelectValue placeholder="เลือกสถาณะ" />
                            </SelectTrigger>
                            <SelectContent align="end" className="w-full" >
                                <SelectItem value="user">ผู้ใช้</SelectItem>
                                <SelectItem value="admin">แอดมิน</SelectItem>
                            </SelectContent>
                        </Select>

                        <AlertDialog open={isOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>คุณแน่ใจ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        คุณต้องการเปลี่ยนบทบาทของ <span className="text-foreground">{row.original.username}</span> เป็น <span className="text-foreground">{row.original.role_text == 'user' ? 'แอดมิน' : 'ผู้ใช้'}</span> หรือไม่?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={()=>{setIsOpen(false); setValue(row.original.role_text)}}>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction onClick={()=>(handdleUpdateRole(row.original.id, value))}>ยืนยัน</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )
            },
        },
    ]



    const columns = createColumns(handdleUpdateRole, () => isFetch);


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
