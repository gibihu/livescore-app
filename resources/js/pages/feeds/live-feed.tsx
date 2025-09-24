import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateMessage } from "@/lib/functions";
import api from "@/routes/api";
import post from "@/routes/post";
import type { PostType } from "@/types/global";
import { Link } from "@inertiajs/react";
import { CirclePoundSterling, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const API_URL: string = import.meta.env.VITE_API_URL;
export default function FeedLive() {
    const [items, setItems] = useState<PostType[]>([]);
    const [isFetch, setIsFetch] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(api.post.feed().url, { credentials: 'include' });
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setItems(data);
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
    }, []);


    return (
        <div className="grid grid-cols-3 gap-4">
            {items.map((item, index) => (
                <Card key={index}>
                    <CardHeader key={index}>
                        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                        <CardDescription>ปลล็อกเพื่ออ่านต่อ</CardDescription>
                        <CardAction>
                            <Button>
                                <CirclePoundSterling className="size-4 text-yellow-600" />
                                <span>{item.points > 0 ? item.points.toLocaleString() : 'free'}</span>
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="relative w-full max-h-100 min-h-40 rounded-xl overflow-hidden shadow-md">
                            <p className="absolute inset-0 flex items-center justify-center text-start font-semibold z-10 px-2">
                                {truncateMessage(generateSecretMessage()+generateSecretMessage(), 150)}
                            </p>

                            <Link href={post.view(item.id).url}>
                                <Button className="h-auto hover:bg-accent/30  absolute inset-0 bg-accent/30 backdrop-blur-md flex items-center justify-center text-gray-600 text-lg font-semibold z-20 transition-opacity duration-300 cursor-pointer">
                                    <span className="flex items-center gap-2 text-foreground"><Lock className="size-5" />  ปลล็อก</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function generateSecretMessage(): string {
    const repeatTimes = Math.floor(Math.random() * (12 - 6 + 1)) + 6; // สุ่ม 6-12 ครั้ง
    return Array.from({ length: repeatTimes }, () => 'ข้อความลับ!').join(' ')
}
