import NavBar from "@/components/nav-bar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/layouts/layout";
import { truncateMessage } from "@/lib/functions";
import api from "@/routes/api";
import { PostType } from "@/types/post";
import { Head, Link } from "@inertiajs/react";
import { CirclePoundSterling, LoaderCircle, Lock, Target } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home(request: any) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const id = request.id as string;
    const [post, setPost] = useState<PostType>();
    const [isLock, setIslock] = useState<boolean>(true);

    const [isLOading, setIsloading] = useState<boolean>(true);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsloading(true);
                const res = await fetch(api.post.show({ id: id }).url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setPost(data);
                    setIslock(false);
                } else if (result.code == 404) {
                    const data = result.data;
                    setPost(data);
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
                setIsloading(false);
            }

        };

        fetchData();
    }, []);

    function handleUnlock() {
        if (post) {
            const fetchData = async () => {
                try {
                    setIsFetch(true);
                    const res = await fetch(api.post.unlock({ id: post.id }).url, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        },
                    });

                    if (!res.ok) {
                        // ถ้า status ไม่ 2xx
                        if (res.status === 401) {
                            const result = await res.json();
                            toast.error(result.message);
                        } else {
                            toast.error('เกิดข้อผิดพลาดจาก server');
                        }
                        return; // ไม่ไป setPost
                    }else{
                        const result = await res.json();
                        if (result.code === 201) {
                            const data = result.data;
                            setPost(data);
                            setIslock(false);
                            toast.error(result.message);
                        }
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

    }


    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">

                {!isLOading ? (
                    post && (
                        <>
                            <Card className="p-2 md:p-4">
                                <div className="w-full flex justify-between gap-2">
                                    <Link href={'#'} className="flex gap-2 items-center">
                                        <Avatar className="size-9">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className=" capitalize texte-sm">{post.user.name}</span>
                                            <span className=" uppercase text-xs  text-muted-foreground">{post.user.tier_text}</span>
                                        </div>
                                    </Link>

                                    {isLock && (
                                        <WannaPayAlert onConfirm={handleUnlock}>
                                            <Button disabled={isFetch}>
                                                <CirclePoundSterling className="size-4 text-yellow-600" />
                                                <span>{post.points > 0 ? post.points.toLocaleString() : 'free'}</span>
                                            </Button>
                                        </WannaPayAlert>
                                    )}

                                </div>
                            </Card>

                            <Card className="p-2">
                                {!isLock ? (
                                    <span>เนื้อหาหลังปลดล็อก</span>
                                ) : (
                                    <div className="relative w-full h-100 rounded-xl overflow-hidden shadow-md">
                                        <p className="absolute inset-0 flex items-start justify-center text-start font-semibold z-10 px-2">
                                            {truncateMessage(generateSecretMessage() + generateSecretMessage(), 1200)}
                                        </p>
                                        <div className="h-auto hover:bg-accent/30  absolute inset-0 bg-accent/30 backdrop-blur-md flex items-center justify-center text-gray-600 text-lg font-semibold z-20 transition-opacity duration-300">
                                            <span className="flex items-center gap-2 text-foreground"><Lock className="size-5" />  ปลล็อก</span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </>
                    )
                ) : (
                    <Card className="p-12 flex justify-center items-center">
                        <LoaderCircle className="size-4 animate-spin" />
                    </Card>
                )}


            </div>
        </AppLayout>
    );
}

function generateSecretMessage(): string {
    const repeatTimes = Math.floor(Math.random() * (200 - 100 + 1)) + 100; // สุ่ม 6-12 ครั้ง
    return Array.from({ length: repeatTimes }, () => 'ข้อความลับ!').join(' ')
}

function WannaPayAlert({ children, onConfirm }: { children?: ReactNode, onConfirm?: (target: boolean) => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
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
                    <AlertDialogAction onClick={() => onConfirm?.(true)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
