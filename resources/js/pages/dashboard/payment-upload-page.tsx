import { ImageDropInput } from "@/components/ImageDropInput";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import api from "@/routes/api";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";



export default function PaymentUploadPage() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const id = usePage().props.id as string;
    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [image, setImage] = useState<File>();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'อัพโหลดสลิป',
            href: dash.payment.upload({ id: id }).url,
        },
    ];

    function handlePaid() {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const formData = new FormData();
                formData.append("status", "awaiting_approval");
                formData.append("id", id);
                if (image) {
                    formData.append("file", image);
                }
                const res = await fetch(api.dash.transaction.paid().url, {
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
                    router.visit(dash.point().url);
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="flex flex-col items-center justify-center gap-4 p-4">

                <ImageDropInput className="w-80 h-120" optional={false} onChange={(file) => file ? setImage(file) : setImage(undefined)} />
                <div className="flex flex-col gap-2 w-80">
                    <Button variant="primary" className="w-full" disabled={isFetch || image == undefined} onClick={() => handlePaid()}>
                        {isFetch && <LoaderCircle className="animate-spin" />}
                        อัพโหลด
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}
