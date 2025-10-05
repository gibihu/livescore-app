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
import { LoaderCircle } from "lucide-react"
import React, { useState } from "react"
import { TableCellViewer, whoWon } from "./board-score"
import ImageWithSkeleton from "@/components/ImageWithSkeleton"
import web from "@/routes/web"
import { Link } from "@inertiajs/react"

interface TypeOfCompo {
    items: FilteredMatchesType[];
    isFetch?: boolean;
    type?: string;
    fixture_date?: string;
}

export function BoardTable({ items, isFetch = false, type = 'live', fixture_date }: TypeOfCompo) {
    const [visibleCount, setVisibleCount] = useState(10);


    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };
    const handleLoadLess = () => {
        setVisibleCount((prev) => prev - 10);
    };

    const visibleData = items.slice(0, visibleCount);
    const date = new Date();

    const fixtureDate1 = new Date(date);
    const fixtureDate2 = new Date(fixtureDate1);
    const fixtureDate3 = new Date(fixtureDate2);

    fixtureDate1.setDate(fixtureDate1.getDate() + 1);
    fixtureDate2.setDate(fixtureDate1.getDate() + 1);
    fixtureDate3.setDate(fixtureDate2.getDate() + 1);

    return (
        <Card className="py-0">
            <Table className="">
                {/* <Table className="table-fixed"> */}
                <TableHeader>
                    <TableRow className="h-12">
                        <TableHead className="text-start">
                            {type == 'live' ? 'ไลฟ์สด' : `การแข่งขันล่วงหน้า`}
                        </TableHead>
                        <TableHead className="w-full">{type == 'fixture' ? (
                            <div className="flex gap-2">
                                <Link href={`${web.match.fixture().url}?date=${fixtureDate1.toISOString().slice(0, 10)}`}>
                                    <Button asChild variant="ghost">
                                        <span>{fixtureDate1.toISOString().slice(5, 10)}</span>
                                    </Button>
                                </Link>
                                <Link href={`${web.match.fixture().url}?date=${fixtureDate2.toISOString().slice(0, 10)}`}>
                                    <Button asChild variant="ghost">
                                        <span>{fixtureDate2.toISOString().slice(5, 10)}</span>
                                    </Button>
                                </Link>
                                <Link href={`${web.match.fixture().url}?date=${fixtureDate3.toISOString().slice(0, 10)}`}>
                                    <Button asChild variant="ghost">
                                        <span>{fixtureDate3.toISOString().slice(5, 10)}</span>
                                    </Button>
                                </Link>
                            </div>
                        ) : ''}</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isFetch ? (items.map((item, index) => (
                        <React.Fragment key={index}>
                            <TableRow className="bg-primary/20">
                                <TableCell colSpan={3}>
                                    <div className="flex gap-2 items-center">
                                        {item.location && (
                                            <>
                                                <span className="size-4 rounded-full">
                                                    <ImageWithSkeleton src={item.location.logo ?? ''} alt={item.location.logo ?? ''} />
                                                </span>
                                                <span>{item.location.name}</span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                            {item.matches?.map((match, key) => {
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
