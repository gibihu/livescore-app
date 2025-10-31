import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { FilteredMatchesType, formatDateLocal, ShortName, timeToShort } from "@/lib/functions"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronDownIcon, Circle, LoaderCircle, Star } from "lucide-react"
import React, { useEffect, useState } from "react"
import { TableCellViewer, whoWon } from "./board-score"
import ImageWithSkeleton from "@/components/ImageWithSkeleton"
import web, { home } from "@/routes/web"
import { Link, router } from "@inertiajs/react"
import { Favorite } from "@/models/favorite"
import { toast } from "sonner"
import { FavoriteType } from "@/types/app"
import { MatchType } from "@/types/match"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"

interface TypeOfCompo {
    request?: any;
    items: any;
    isFetch?: boolean;
    type?: string;
}

export function BoardTable({ request, items, isFetch = false, type = 'live' }: TypeOfCompo) {
    const [favorites, setFavorites] = useState<FavoriteType[]>([]);

    useEffect(() => {
        setFavorites(Favorite.get());
    }, []);

    const handleFavorite = (match_id: string, status?: string) => {
        try {
            // ใช้ update() → จะอัปเดตหรือสร้างใหม่
            const updatedFavorite = Favorite.update(match_id, { status: status ?? 'active' });

            // อัปเดต state
            setFavorites((prev) => {
                const existsIndex = prev.findIndex(f => f.match_id === match_id);
                if (existsIndex !== -1) {
                    // มีอยู่แล้ว → replace element
                    const newArr = [...prev];
                    newArr[existsIndex] = updatedFavorite;
                    return newArr;
                } else {
                    // ไม่มี → เพิ่มใหม่
                    return [...prev, updatedFavorite];
                }
            });

            toast.success('อัพเดทรายการโปรดเรียบร้อย');
        } catch (error) {
            console.error('Error:', error);
            let message = "เกิดข้อผิดพลาดบางอย่าง";
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "string") {
                message = error;
            }
            toast.error(message);
        }
    };


    return (
        <Card className="py-0">
            <Table className="">
                {/* <Table className="table-fixed"> */}
                <TableHeader>
                    <TableRow className="h-12">
                        <TableHead className="w-full" colSpan={3}>
                            <div className="w-full flex gap-3 justify-between items-center">

                                <span>
                                    {type == 'live' ? 'ไลฟ์สด' : `ตารางการแข่งขัน`}
                                </span>
                                {type == 'fixture' ? (() => {
                                    const [date, setDate] = React.useState<Date | undefined>(
                                        request.fixture_date ? new Date(request.fixture_date) : new Date()
                                    );


                                    function handleClick(date: Date | undefined) {
                                        if (!date) return;

                                        const value = formatDateLocal(date);
                                        router.visit(`${home().url}?date=${value}`);
                                    }
                                    return (
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-max justify-between font-normal"
                                                >
                                                    {date ? date.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDate(date)
                                                        handleClick(date);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    );
                                })() : ''}
                            </div>
                        </TableHead>
                        {/* <TableHead colSpan={2}></TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isFetch ? (items.length > 0 ? (items.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                            <TableRow className="bg-primary/20">
                                <TableCell colSpan={4}>
                                    <div className="flex gap-2 items-center">
                                        {item.league && (
                                            <>
                                                <span className="size-4 rounded-full">
                                                    {item.country ? (
                                                        <ImageWithSkeleton src={item.country.country_id ? `/flag?type=country&id=${item.country.country_id}` : 'https://cdn.live-score-api.com/teams/dc6704744f1bc0d01d3740eff2e5e3ec.png'} alt={item.country.name ?? ''} />
                                                    ) : (
                                                        <ImageWithSkeleton src={'https://cdn.live-score-api.com/teams/dc6704744f1bc0d01d3740eff2e5e3ec.png'} alt={item.league.name ?? ''} />
                                                    )}
                                                </span>
                                                <div className="flex gap-1 items-end">
                                                    <span>{item.league.name}</span>
                                                    {item.country && (
                                                        <span className="text-xs">({item.country.name})</span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                            {item.matches?.map((match: MatchType, key: number) => {
                                const [homeScoreStr, awayScoreStr] = (match.scores?.score?.split(" - ").map(s => s.trim())) ?? ["?", "?"];
                                return (
                                    <TableRow key={key}>
                                        <TableCell className="max-w-12 md:max-w-10">
                                            <Link href={web.match.view({ id: match.id }).url}>
                                                <div className="flex flex-col justify-center items-center w-full">
                                                    <div className="flex gap-2">
                                                        <span>{match.scheduled ? match.scheduled?.slice(0, 5) : match.date?.toString().slice(5, 10)}</span>
                                                        <span>|</span>
                                                        <ShowTimeOrText item={match} />
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-4 h-full">
                                                <div className="w-1 h-12 rounded-full bg-input"></div>
                                                <div className="w-full flex-col justify-between">
                                                    <Link href={web.match.view({ id: match.id }).url}>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex gap-2  items-center justify-between w-full">
                                                                <div className="flex gap-2 items-center">
                                                                    <img src={match.home.logo} alt={match.home.logo} className="size-4" />
                                                                    <span className={cn("line-clamp-1 hidden md:block")}>{match.home.name}</span>
                                                                    <span className={cn("line-clamp-1 md:hidden")}>{ShortName(match.home.name)}.</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span>{homeScoreStr}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2  items-center justify-between w-full">
                                                                <div className="flex gap-2 items-center">
                                                                    <img src={match.away.logo} alt={match.away.logo} className="size-4" />
                                                                    <span className={cn("line-clamp-1 hidden md:block")}>{match.away.name}</span>
                                                                    <span className={cn("line-clamp-1 md:hidden")}>{ShortName(match.away.name)}.</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span>{awayScoreStr}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="w-1 h-12 rounded-full bg-input"></div>
                                            </div>
                                        </TableCell>
                                        {/* <TableCell className="min-w-15">
                                            <Link href={web.match.view({ id: match.id }).url}>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <div className="flex flex-col text-xs items-center justify-center gap-1">
                                                        <span>{match.odds?.pre?.['1'] ?? '-'}</span>
                                                        <span>{match.odds?.pre?.['X'] ?? '-'}</span>
                                                        <span>{match.odds?.pre?.['2'] ?? '-'}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell> */}
                                        <TableCell className="max-w-8 md:max-w-5">
                                            <div className="w-max flex items-center justify-center">
                                                {
                                                    (() => {
                                                        const fav = favorites.find((fav: FavoriteType) => fav.match_id === match.id);
                                                        if (!fav || fav.status != "atctive") return (
                                                            <Button variant="ghost" onClick={() => handleFavorite(match.id, "atctive")}>
                                                                <Star className="text-amber-400" />
                                                            </Button>
                                                        );

                                                        return fav.status == "atctive" ? (
                                                            <Button variant="ghost" onClick={() => handleFavorite(fav.match_id, 'inactive')}>
                                                                <Star className="text-amber-400" fill="currentColor" />
                                                            </Button>
                                                        ) : (null);
                                                    })()
                                                }

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </React.Fragment>
                    ))) : (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <div className="w-full flex justify-center">
                                    <span className="text-muted-foreground">ไม่พบข้อมูล</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <div className="w-full flex justify-center">
                                    <LoaderCircle className="animate-spin size-5" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* <div className="mt-4 flex flex-col items-center justify-center gap-2">
                {visibleCount < items.length ? (
                    <>
                        <span className="text-ring text-sm">ยังมีอีก {items.length - visibleCount} ทีมที่กำลังแข่งขัน</span>
                        <div className="flex gap-2">
                            {visibleCount > 20 && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>}
                            <Button onClick={handleLoadMore}>แสดงเพิ่ม</Button>
                        </div>
                    </>
                ) : (visibleCount == items.length && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>)}
            </div> */}
        </Card>
    )
}


function ShowTimeOrText({ item }: { item: MatchType }) {
    return (
        <div className="text-primary flex gap-0 items-center">
            {item.status == "IN PLAY" && item.time !== 'FT' ? (
                <span className="flex gap-1 items-start">
                    {item.time.length <= 6 ? item.time : timeToShort(item.time.slice(0, 5))}
                    <Circle fill="currentColor" className="text-primary size-1.5 animate-pulse" />
                </span>
            ): (
                <span>
                    {item.time !== "FT" && item.time !== "HT" ? (
                        timeToShort(item.time.slice(0, 5))
                    ) : (
                        item.time
                    )}
                </span>
            )
        }
        </div>
    );
}
