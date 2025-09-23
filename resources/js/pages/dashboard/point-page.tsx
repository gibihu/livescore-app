import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { formatDateTime, timeDiff, timeDiffRounded, translateStatus } from "@/lib/functions";
import api from "@/routes/api";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import type { TransactionType } from "@/types/global";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import SelectPackpoint from "../../components/dashboard/pack-point";



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'พอยต์',
        href: dash.point().url,
    },
];
export default function PackPointPage() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [items, setItems] = useState<TransactionType[]>([]);

    function handdleCreate(id: string | null) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                // const csrfToken: string = await csrf();
                // if (!csrfToken) {
                // throw new Error('Failed to get CSRF token');
                // }
                const res = await fetch(api.dash.transaction.create().url, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '', // token ต้องถูกส่ง
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id
                    })
                });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    const data = result.data;
                    router.visit(dash.payment.show({ id: data.id }).url);
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
        if (id !== null) {
            fetchData();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.transaction.history().url);
                if (res.status == 200) {
                    const result = await res.json();
                    const data = result.data;
                    // console.log(data);
                    setItems(data);
                } else {
                    const result = await res.json();
                    const errors = result.errors;
                    toast.error(result.message, { description: errors.detail || errors.code || '' });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }
        fetchData();
    }, []);

    function handleUpdate(id: string, status: string) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                // const csrfToken: string = await csrf();
                // if (!csrfToken) {
                // throw new Error('Failed to get CSRF token');
                // }
                const res = await fetch(api.dash.transaction.update().url, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '', // token ต้องถูกส่ง
                        // 'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        status: status,
                        id: id,
                    })
                });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    setItems(prev =>
                        prev.map(item =>
                            item.id === id ? { ...item, status } : item
                        )
                    );

                } else {
                    const result = await res.json();
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



    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">
                <SelectPackpoint onSubmit={(id) => handdleCreate(id || null)}
                    disabled={isFetch}
                />


                <div className="p-4">
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">สลิป</TableHead>
                                <TableHead className="text-start">รายละเอีบด</TableHead>
                                <TableHead className="text-center">อนุมัติเวลา</TableHead>
                                <TableHead className="text-center">สถาณะ</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isFetch ? (
                                items.map((item, index) => (
                                    <TableRow className="h-16" key={index}>
                                        <TableCell className="">
                                            <TableViewImage item={item}>
                                                {item.status_text !== "pending" && item.status_text !== "cancle" &&
                                                    <img className="size-15  rounded-md  object-cover" src={item.slip_url}
                                                        alt={item.slip_url} />
                                                }
                                            </TableViewImage>
                                        </TableCell>
                                        <TableCell className="text-start">
                                            <div className="flex flex-col">
                                                <span>เติม {item.points} พอยต์</span>
                                                <span>ราคา {item.amount} {item.currency}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span>{formatDateTime(item.approved_at || '')}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.status_text == 'pending' ? (
                                                <Tooltip>
                                                    <TooltipTrigger>หมดอายุ {timeDiffRounded(item.expired_at)}</TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{timeDiff(item.expired_at)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : translateStatus(item.status_text ?? '')}
                                        </TableCell>
                                        <TableCell className="max-w-20">
                                            <div className="flex gap-2 justify-end">
                                                {item.status_text == 'pending' && (
                                                    <>
                                                        <Button variant="destructive" onClick={() => handleUpdate(item.id, 'cancel')}>ยกเลิก</Button>
                                                        <Link href={dash.payment.show({ id: item.id }).url}>
                                                            <Button variant="default">ทำต่อ</Button>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (null)}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
};


export function TableViewImage({ item, className, children }: {
    item: TransactionType, className?:
    string, children?: ReactNode
}) {
    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="max-h-svh max-w-[90svw] w-max sm:max-w-auto">
                <DialogTitle className="sr-only">หัวเรื่องของ dialog</DialogTitle>
                <DialogHeader>
                    <DialogDescription>
                        <ImageWithSkeleton src={item.slip_url ?? ''} alt={item.slip_url ?? 'No Image'}
                            title='' className='max-h-[90svh] max-w-[90svw] w-max object-contain' />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
