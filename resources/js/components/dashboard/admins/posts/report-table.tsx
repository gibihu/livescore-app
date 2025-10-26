import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import web from "@/routes/web";
import { ReportType } from "@/types/post";
import { MoreHorizontal } from "lucide-react";

export default function ReportTable({ items }: { items: ReportType[] }) {
    return (
        <Card className="p-0 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full">รายละเอียด</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(items && items.length > 0) ? items.map((item: ReportType, index: number) => (
                        <TableRow key={index}>
                            <TableCell className="flex flex-col">
                                <span><span className="text-muted-foreground">เรื่อง:</span> {item.title}</span>
                                {item.description && (<span><span className="text-muted-foreground">รายละเอียด:</span> {item.description}</span>)}
                                <span><span className="text-muted-foreground">หมวดหมู่:</span> {item.category}</span>
                            </TableCell>
                            <TableCell>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="default" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="text-sm text-muted-foreground">ดำเนินการ</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {item.post_id && (
                                            <DropdownMenuItem asChild>
                                                <a href={web.post.view({ id: item.post_id }).url ?? '#'} target="_blank">
                                                    ตรวจสอบ
                                                </a>
                                            </DropdownMenuItem>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="w-full ps-2 justify-start">
                                                    ลบโพสต์
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction asChild>
                                                        <DropdownMenuItem asChild>
                                                            <Button variant="default">ยืนยัน</Button>
                                                        </DropdownMenuItem>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                                ไม่มีรายการ
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
