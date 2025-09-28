

import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { UserTable } from "../../../../components/dashboard/admins/user-table";
import { Head, Link, router } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { TransactionType } from "@/types/global";
import { ImageDropInput } from "@/components/ImageDropInput";
import { toast } from "sonner";
import api from "@/routes/api";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ดำเนินการแลกเปลี่ยน',
        href: dash.admin.users.table().url,
    },
];
export default function EcxhangePage(param: any) {
    const [trans, setTrans] = useState<TransactionType>(param.trans);
    const [tabValue, setTabValue] = useState<"verify" | "evidence">("verify");
    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">

                <Tabs defaultValue="verify" value={tabValue} onValueChange={(value) => setTabValue(value as "verify" | "evidence")}>
                    <TabsList>
                        <TabsTrigger value="verify">ยืนยันตัวตบ</TabsTrigger>
                        <TabsTrigger value="evidence">หลักฐาน</TabsTrigger>
                    </TabsList>
                    <TabsContent value="verify">
                        <HowToVerify param={param} onClick={(e) => setTabValue(e)} />
                    </TabsContent>
                    <TabsContent value="evidence">
                        <UploadEvidence param={param} />
                    </TabsContent>
                </Tabs>

            </div>
        </AppLayout>
    )
}



function HowToVerify({ onClick, param }: { onClick: (i: "verify" | "evidence") => void, param: any }) {

    const [item, setItem] = useState<TransactionType>(param.trans);

    return (
        <div className="flex flex-col items-center justify-center gap-4">

            <div className="flex flex-col gap-4 max-w-3/4">
                <div className="w-full h-full  max-w-100 max-h-100  p-6">
                    <img className="w-full  border  rounded-xl  shadow-xl" src="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png" alt="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png" />
                </div>
                <div>
                    <p><span className="text-muted-foreground">รหัสอ้างอิง:</span> {item.user_reference}</p>
                    <p><span className="text-muted-foreground">จำนวนเงิน:</span> {item.amount}.</p>
                    <p><span className="text-muted-foreground">พอยท์ที่จะได้รับ:</span> {item.points} พอยท์</p>
                    <p><span className="text-muted-foreground">อัตราการแลกเปลี่ยน: 1:</span> {item.rate + ' ' + item.currency}</p>
                </div>
                <Button variant="primary" className="shadow-xl" onClick={() => onClick('evidence')}>
                    ดำเนินการต่อ
                </Button>
                <Link href={dash.admin.users.payment().url}>
                    <Button variant="outline" className="w-full  shadow-xl">
                        ย้อยกลับ
                    </Button>
                </Link>
                <CardDescription>
                    <p>วิธีชำระผ่านแอพธนาคาร</p>
                    <ul className="list-decimal ps-5">
                        <li>เปิดแอพธนาคาร</li>
                        <li>กดไอคอนสแกน</li>
                        <li>สแกนคิวอาร์โค้ดที่อยู่บนเจอ</li>
                        <li>ตรวจสอบจำนวนเงิน</li>
                        <li>กดยืนยัน</li>
                    </ul>
                </CardDescription>
            </div>

        </div>
    );
}


function UploadEvidence({param}:{param: any}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const [item, setItem] = useState<TransactionType>(param.trans);
    const [image, setImage] = useState<File>();
    const [isFetch, setIsFetch] = useState<boolean>(false);

    function handlePaid() {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const formData = new FormData();
                formData.append("id", item.id);
                formData.append("file", image || '');
                const res = await fetch(api.dash.admin.trans.exchange().url, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'X-CSRF-TOKEN': csrfToken ?? '',
                    },
                    body: formData,
                });
                const result = await res.json();
                if (result.code == 201) {
                    toast.success(result.message);
                    router.visit(dash.admin.users.payment().url);
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

        if (image) {
            fetchData();
        } else {
            toast.error("โปรดอัพโหลดในเสร็จโอนเงินของคุณ");
        }
    }


    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4">

            <ImageDropInput className="w-80 h-120" optional={false} onChange={(file) => file ? setImage(file) : setImage(undefined)} />
            <div className="flex flex-col gap-2 w-80">
                <Button variant="primary" className="w-full" disabled={isFetch || image == undefined} onClick={() => handlePaid()}>
                    {isFetch && <LoaderCircle className="animate-spin" />}
                    อัพโหลด
                </Button>
            </div>

        </div>
    );
}
