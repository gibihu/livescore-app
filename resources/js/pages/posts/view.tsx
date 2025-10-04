import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/layouts/layout";
import { ShortName, truncateMessage } from "@/lib/functions";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import web from "@/routes/web";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import { Head, Link } from "@inertiajs/react";
import { CirclePoundSterling, LoaderCircle, Lock, Target } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
export default function View(request: any) {
    console.log(request);
    const [post, setPost] = useState<PostType>(request.post as PostType);
    const [isUnLock, setIsUnLock] = useState<boolean>(request.is_unlock ?? false as boolean);
    const [follow, setFollow] = useState<any>(request.follow as any);

    const [isLOading, setIsloading] = useState<boolean>(false);
    const [isFetch, setIsFetch] = useState<boolean>(false);

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
                    } else {
                        const result = await res.json();
                        if (result.code === 201) {
                            const data = result.data;
                            setPost(data);
                            setIsUnLock(false);
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
                <MenuBar />

                {!isLOading ? (
                    post && (
                        <>
                            <Card className="p-2">
                                <MatchBoard item={post.match} raw={post} />
                            </Card>
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

                                    <div className="flex gap-2">
                                        {follow !== false && (
                                            <>
                                                <Link href={web.post.report.index({ post_id: post.id }).url}>
                                                    <Button variant="destructive">รายงาน</Button>
                                                </Link>
                                                {!isUnLock && (
                                                    <WannaPayAlert onConfirm={handleUnlock}>
                                                        <Button disabled={isFetch}>
                                                            <CirclePoundSterling className="size-4 text-yellow-600" />
                                                            <span>{post.points > 0 ? post.points.toLocaleString() : 'free'}</span>
                                                        </Button>
                                                    </WannaPayAlert>
                                                )}
                                                <FollowSpace post={post} follow={request.follow} />
                                            </>
                                        )}
                                    </div>

                                </div>
                                {isUnLock ? (
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


function FollowSpace({ post, follow }: { post: PostType, follow: any }) {
    // const post = request.
    const [item, setItem] = useState<any>(follow);
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [isFetch, setIsFetch] = useState<boolean>(false);


    function handleFollow() {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.follow.update({ user_id: post.user_id }).url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                });

                const result = await res.json();
                if (result.code === 200) {
                    setIsFollow(false);
                    toast.success(result.message);
                } else if (result.code === 201) {
                    setIsFollow(true);
                    toast.success(result.message);
                } else {
                    toast.success(result.message);
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
        };
        fetchData();
    }


    return (
        <>
            <Button variant={isFollow ? "outline" : "primary"} disabled={isFetch} onClick={handleFollow}>
                {isFollow ? "ติดตามแล้ว" : "ติดตาม"}
            </Button>
        </>
    );
}




function MatchBoard({ raw ,item }: { raw: PostType, item: MatchType }) {
    return (
        <div className="flex flex-col gap-4 items-center justify-center">

            <div className="w-full flex gap-2 justify-between">
                <div className="flex gap-2">
                    <span className="text-primary">{raw.type_text}</span>
                    <span className="text-muted-foreground">{item.country.name}</span>
                    <span className="text-muted-foreground">{item.date_th_short?.replaceAll("-", "/")}</span>
                    <span className="text-muted-foreground">{item.time.slice(0, 5)}</span>
                </div>
            </div>

            <div className="flex gap-2 items-center justify-center">
                <Avatar className=" size-4 rounded-none w-6">
                    <AvatarImage src={`/flag?type=country&id=${item.country.country_id}`} />
                    <AvatarFallback className="animate-pulse" />
                </Avatar>
                <span className="text-muted-foreground  text-sm md:text-base">{item.country.name}</span>
            </div>

            <div className="w-full flex gap-4 justify-center items-center">
                <div className="w-full flex justify-end"><Podium item={item.home} logo_position="end" /></div>
                <div className="flex flex-col gap-2">
                    <span className=" text-sm md:text-xl font-bold">VS</span>
                </div>
                <div className="w-full flex justify-start"><Podium item={item.away} /></div>

            </div>
        </div>
    );
}

function Podium({ item, logo_position = 'start' }: { item: any, logo_position?: string }) {
    return (
        <div className={cn("flex flex-col md:flex-row gap-2 items-center", logo_position == 'end' ? 'md:flex-row-reverse' : '')}>
            <Avatar className=" size-8 md:size-10">
                <AvatarImage src={item.logo} />
                <AvatarFallback className="animate-pulse" />
            </Avatar>
            <span className="text-sm md:text-base text-end">{item.name}</span>
        </div>
    );
}
