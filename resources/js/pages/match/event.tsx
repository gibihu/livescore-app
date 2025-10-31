import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EventTrans } from "@/lib/functions";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import type { EventType } from "@/types/event";
import type { MatchType } from "@/types/match";
import { CornerLeftUp, Crosshair, GalleryHorizontalEnd, LoaderCircle, RectangleVertical, RefreshCcwDot, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function MatchEvent({ match_id, main_item }: { match_id: string, main_item: MatchType }) {
    const [data, setData] = useState<any[]>([]);
    const [events, setEvents] = useState<EventType[]>([]);
    const [match, setMatch] = useState<any[]>([]);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoad(true);
                // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
                const res = await fetch(`${api.match.event().url}?id=${match_id}&status=${main_item.status}`);

                const result = await res.json();
                // if (result.code == 200) {
                if (result.code == 200) {
                    const data = await result.data;
                    setEvents(data.event);
                    // console.log(data.event);
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
                setIsLoad(false);
            }
        };
        fetchData();
    }, [match_id]);

    return (
        <>
            {isLoad ? (
                <div className="w-full flex justify-center">
                    <LoaderCircle className="animate-spin size-6" />
                </div>
            ) : events.length > 0 ? (
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-end">เจ้าบ้าน</TableHead>
                            <TableHead className="w-20 text-center bg-border">นาทีที่</TableHead>
                            <TableHead>ทีมเยือน</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((item, index) => (
                            (() => {
                                const home_logo = main_item.home.logo;
                                const away_logo = main_item.away.logo;
                                const done_logo = item.home_away == 'h' ? home_logo : away_logo
                                return (
                                    <TableRow key={index} className="group hover:text-accent-foreground">
                                        {/* <TableCell>
                                            <img src={done_logo} alt={done_logo} className="size-6" />
                                        </TableCell> */}
                                        {/* <TableCell className="font-medium">{EventTrans(item.event)}</TableCell> */}
                                        <TableCell>
                                            <div className="w-full flex gap-2 justify-end px-2 md:px-4">
                                                {item.home_away == "h" && (
                                                    <div className="flex gap-2 items-center">
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <RenderEventGraphic event={item.event} home_away="a" className="size-4" /></TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{EventTrans(item.event)}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <span>{item.player}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center bg-border">{item.time}'</TableCell>
                                        <TableCell>
                                            <div className="w-full flex gap-2 items-center  px-2 md:px-4">
                                                {item.home_away == "a" && (
                                                    <div className="flex gap-2 items-center">
                                                        <span>{item.player}</span>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <RenderEventGraphic event={item.event} home_away="a" className="size-4" /></TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{EventTrans(item.event)}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })()
                        ))}
                    </TableBody>
                </Table>
            ) : <div className="w-full text-center text-ring">ไม่พบอีเว้นของแมตช์นี้</div>
            }
        </>
    );
}


function RenderEventGraphic({ event, className, home_away = 'h' }: { event: string, className?: React.ReactNode, home_away?:string }) {
    switch (event) {
        case 'GOAL':
            return <Target className={cn("text-success", className)} />;
        case 'GOAL_PENALTY':
            return <Crosshair className={cn("text-success", className)} />;
        case 'OWN_GOAL':
            return <Target className={cn("text-destructive", className)} />;
        case 'YELLOW_CARD':
            return <RectangleVertical fill="currentColor" className={cn("text-yellow-600", className)} />;
        case 'RED_CARD':
            return <RectangleVertical fill="currentColor" className={cn("text-red-600", className)} />;
        case 'YELLOW_RED_CARD':
            return <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={cn("lucide", className, home_away == 'a' && 'rotate-180')}>
                    {/* แท่งแดง */}
                    <path d="M2 7v10" stroke="yellow" />

                    {/* แท่งเหลือง */}
                    <path d="M6 5v14" stroke="yellow" />
                    <rect width="12" height="18" x="10" y="3" rx="2" fill="red" stroke="red" />
                </svg>
            </>;
        case 'SUBSTITUTION':
            return <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={cn("lucide", className)}>
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" className="text-red-600" />
                    <path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" stroke="currentColor" className="text-primary" />
                    <path d="M16 16h5v5" stroke="currentColor" className="text-primary" />
                    <circle cx="12" cy="12" r="1" stroke="currentColor" className="text-primary" />
                </svg>
            </>;
        case 'MISSED_PENALTY':
            return <Crosshair className={cn("text-destructive", className)} />;
        default:
            return <></>;
    }
}
