
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import api from "@/routes/api";
import { UserRankType } from "@/types/user";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function RankPage() {
    const [items, setItems] = useState<UserRankType[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(api.rank.feed().url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setItems(data as UserRankType[]);
                } else {
                    toast.error(result.message, { description: result.description ?? '' });
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
                setIsLoad(false);
            }
        }
        fetchData();
    }, []);

    let number = 1;

    return (
        <Card className="px-4">
            <div className="grid grid-col-1 gap-4 ">
                {!isLoad ? (
                    items.length > 0 ? (
                        items.map((item: UserRankType, key: number) => (
                            <>
                                <div className="flex gap-3 justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-bold">{number++}</span>
                                        <Avatar>
                                            <AvatarImage src={item.user?.avatar ?? 'https://cdn.live-score-api.com/teams/dc6704744f1bc0d01d3740eff2e5e3ec.png'} alt={item.user?.name} />
                                            <AvatarFallback className="animate-pulse" />
                                        </Avatar>
                                        <div className="flex flex-col gap-0">
                                            <span className="text-sm">{item.user?.name}</span>
                                            <span className="text-xs text-muted-foreground">@{item.user?.username}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-center justify-center">
                                        <span className="text-xs text-muted-foreground">{item.score}</span>
                                        <span className="text-xs font-bold">{item.level_text}</span>
                                    </div>
                                </div>
                            </>
                        ))
                    ) : (
                        <div className="flex justify-center text-muted-foreground">
                            ไม่การจัดอันดับ
                        </div>
                    )
                ) : (
                    <div className="flex justify-center">
                        <LoaderCircle className="size-4 animate-spin" />
                    </div>
                )}
            </div>
        </Card>
    );
}
