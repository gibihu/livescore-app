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
import { FilteredMatchesType, ShortName } from "@/lib/functions"
import { cn } from "@/lib/utils"
import { LoaderCircle, Star } from "lucide-react"
import React, { useEffect, useState } from "react"
import { TableCellViewer, whoWon } from "./board-score"
import ImageWithSkeleton from "@/components/ImageWithSkeleton"
import web from "@/routes/web"
import { Link } from "@inertiajs/react"
import { Favorite } from "@/models/favorite"
import { toast } from "sonner"
import { FavoriteType } from "@/types/app"
import { MatchType } from "@/types/match"

interface TypeOfCompo {
    items: any;
    isFetch?: boolean;
    type?: string;
}

export function BoardTable({ items, isFetch = false, type = 'live' }: TypeOfCompo) {
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
                        <TableHead className="text-start">
                            {type == 'live' ? 'ไลฟ์สด' : `ตารางการแข่งขัน`}
                        </TableHead>
                        <TableHead className="w-full">
                            {type == 'fixture' ? (() => {
                                const date = new Date();

                                const fixtureDate1 = new Date(date);
                                const fixtureDate2 = new Date(fixtureDate1);
                                const fixtureDate3 = new Date(fixtureDate2);

                                const fixtureDate_2 = new Date(fixtureDate1);
                                const fixtureDate_3 = new Date(fixtureDate1);

                                fixtureDate1.setDate(fixtureDate1.getDate() + 1);
                                fixtureDate2.setDate(fixtureDate1.getDate() + 1);
                                fixtureDate3.setDate(fixtureDate2.getDate() + 1);

                                fixtureDate_2.setDate(fixtureDate1.getDate() - 2);
                                fixtureDate_3.setDate(fixtureDate_2.getDate() - 1);
                                return (
                                    <div className="flex gap-2">
                                        <Link href={`${web.home().url}?date=${fixtureDate_3.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost" className="text-muted-foreground">
                                                <span>{fixtureDate_3.toISOString().slice(5, 10)}</span>
                                            </Button>
                                        </Link>
                                        <Link href={`${web.home().url}?date=${fixtureDate_2.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost" className="text-muted-foreground">
                                                <span>{fixtureDate_2.toISOString().slice(5, 10)}</span>
                                            </Button>
                                        </Link>
                                        <Link href={`${web.home().url}?date=${date.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost">
                                                <span>วันนี้</span>
                                            </Button>
                                        </Link>
                                        <Link href={`${web.home().url}?date=${fixtureDate1.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost">
                                                <span>{fixtureDate1.toISOString().slice(5, 10)}</span>
                                            </Button>
                                        </Link>
                                        <Link href={`${web.home().url}?date=${fixtureDate2.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost">
                                                <span>{fixtureDate2.toISOString().slice(5, 10)}</span>
                                            </Button>
                                        </Link>
                                        <Link href={`${web.home().url}?date=${fixtureDate3.toISOString().slice(0, 10)}`}>
                                            <Button asChild variant="ghost">
                                                <span>{fixtureDate3.toISOString().slice(5, 10)}</span>
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })() : ''}
                        </TableHead>
                        <TableHead colSpan={2}></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isFetch ? (items.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                            <TableRow className="bg-primary/20">
                                <TableCell colSpan={4}>
                                    <div className="flex gap-2 items-center">
                                        {item.league && (
                                            <>
                                                <span className="size-4 rounded-full">
                                                    {item.country ? (
                                                        <ImageWithSkeleton src={item.country.country_id ? `/flag?type=country&id=${item.country.country_id}` : 'https://cdn.live-score-api.com/teams/dc6704744f1bc0d01d3740eff2e5e3ec.png'} alt={item.country.name ?? ''} />
                                                    ) :(
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
                                        <TableCell>
                                            <TableCellViewer item={match} className="h-14 w-full" matchEvent={type == 'fixture' ? false : true} type={type}>
                                                <div className="flex flex-col justify-center items-center w-full">
                                                    <div className="flex gap-2">
                                                        <span>{match.scheduled ? match.scheduled?.slice(0, 5) : match.date?.toString().slice(5, 10)}</span>
                                                        <span>|</span>
                                                        <span className={cn('font-bold', (match.status !== 'NOT STARTED' && match.status !== 'FINISHED') ? "text-primary" : '')}>{type == 'live' ? match.time : match.time.slice(0, 5)}</span>
                                                    </div>
                                                </div>
                                            </TableCellViewer>
                                        </TableCell>
                                        <TableCell className="flex items-center space-x-4">
                                            <div className="w-1 h-12 rounded-full bg-input"></div>
                                            {type == 'fixture' ? (
                                                <TableCellViewer item={match} className="w-full h-14" matchEvent={type == 'fixture' ? false : true} type={type}>
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
                                                </TableCellViewer>
                                            ) : (
                                                <div className="w-full">
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
                                            )}
                                            <div className="w-1 h-12 rounded-full bg-input"></div>
                                        </TableCell>
                                        <TableCell className="min-w-15">
                                            <TableCellViewer item={match} className="w-full h-full" matchEvent={type == 'fixture' ? false : true} type={type}>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <div className="flex flex-col text-xs items-center justify-center gap-1">
                                                        <span>{match.odds?.pre?.['1'] ?? '-'}</span>
                                                        <span>{match.odds?.pre?.['X'] ?? '-'}</span>
                                                        <span>{match.odds?.pre?.['2'] ?? '-'}</span>
                                                    </div>
                                                </div>
                                            </TableCellViewer>
                                        </TableCell>
                                        <TableCell className="min-w-15 flex gap-2">
                                            <div className="w-1 h-12 rounded-full bg-input"></div>
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
