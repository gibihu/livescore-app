
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, translateStatus } from "@/lib/functions";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import dash from "@/routes/dash";
import type { TransactionType } from "@/types/global";
import { Link } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export default function UserPaymentTable() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [items, setItems] = useState<TransactionType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(api.dash.admin.trans.users.payment().url);
                if (res.status == 200) {
                    const result = await res.json();
                    const data = result.data;
                    setItems(data);
                } else {
                    const result = await res.json();
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);




    function handleChange(id: string, status: string) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.admin.trans.update().url, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken ?? ''
                    },
                    body: JSON.stringify({
                        id: id,
                        status: status,
                    })
                });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    setItems(prev => prev.filter(item => item.id !== id));
                } else {
                    const errors = await res.json();
                    toast.error(errors.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }
        fetchData();
    }

    return (
        <Card className="py-0 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] ps-4">สลิป</TableHead>
                        <TableHead className="text-start">รายละเอีบด</TableHead>
                        <TableHead className="text-start">เลขอ้างอิง</TableHead>
                        <TableHead className="text-center">เวลา</TableHead>
                        <TableHead className="text-center">สถาณะ</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading ? (
                        items.length > 0 ? (
                            items.map((item, index) => (
                                <TableRow className="h-16" key={index}>
                                    {item.type_text == 'deposit' &&
                                        <TableCell className="">
                                            <TableViewImage item={item} className="min-w-12">
                                                <img className="size-15  rounded-md  object-cover" src={item.slip_url} alt={item.slip_url} />
                                            </TableViewImage>
                                        </TableCell>
                                    }
                                    <TableCell className={cn('text-start min-w-20', item.type_text == 'withdraw' && 'col-start-1')} colSpan={item.type_text == 'deposit' ? 1 : 2}>
                                        <div className="flex flex-col">
                                            {item.type_text == 'deposit' ? (
                                                <>
                                                    <span>เติม {item.points} พอยต์</span>
                                                    <span>ราคา {item.amount} {item.currency}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>แลกเงิน {item.amount} {item.currency}</span>
                                                    <span>จาก {item.points} พอยต์ | เรต {item.rate}</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-start min-w-12">
                                        {item.user_reference}
                                    </TableCell>
                                    <TableCell className="text-center">{formatDateTime(item.paid_at || '')}</TableCell>
                                    <TableCell className="text-center">{translateStatus(item.status_text || '')}</TableCell>
                                    <TableCell className="max-w-40  min-w-20">
                                        {item.type_text == 'deposit' ? (
                                            <div className="flex gap-2 justify-end">

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" disabled={isFetch}>
                                                            {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                                            ปฏิเสธ
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>ต้อการปฏิเสธหรือไม่?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                แน่ใจที่จะกดปฏิเสธไหม?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>ปิด</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleChange(item.id, 'rejected')}>ปฏิเสธ</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>


                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant='primary' disabled={isFetch}>
                                                            {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                                            อนุมัติ
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>ต้องการยินยันหรือไม่</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                การกดยืนยันจะเพิ่มพอยต์ให้ผู้ซื้อทันที คุณแน่ใจว่าได้ตรวจสอบการทำธุรกรมมแล้ว?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>ปิด</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleChange(item.id, 'approved')}>อนุมัติ</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                            </div>
                                        ) : (
                                            <div className="flex gap-2 justify-end">
                                                <Link href={dash.admin.exchange.index({id: item.id}).url}>
                                                    <Button variant="default" asChild>
                                                        <span>ดำเนินการ</span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="ps-4">
                                    <div className="w-full flex justify-center py-4">
                                        <span className="text-muted-foreground">ไม่มีข้อมูล</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="ps-4">
                                <div className="w-full flex justify-center py-4">
                                    <LoaderCircle className="animate-spin size-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}


export function TableViewImage({ item, className, children }: { item: TransactionType, className?: string, children?: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="max-h-svh max-w-[90svw] w-max sm:max-w-auto">
                <DialogTitle className="sr-only">หัวเรื่องของ dialog</DialogTitle>
                <DialogHeader>
                    <DialogDescription asChild>
                        <ImageWithSkeleton
                            src={item.slip_url ?? ''}
                            alt={item.slip_url ?? 'No Image'}
                            title=''
                            className='max-h-[90svh] max-w-[90svw] w-max object-contain'
                        />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
