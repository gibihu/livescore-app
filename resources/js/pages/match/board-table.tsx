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
import { convertUTC, ShortName } from "@/lib/functions"
import { cn } from "@/lib/utils"
import { CompetitionType } from "@/types/league"
import { LoaderCircle } from "lucide-react"
import React, { useState } from "react"
import { MatcTimehBadge, TableCellViewer, whoWon } from "./board-score"
import { PostType } from "@/types/post"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@inertiajs/react"
import * as route_post from "@/routes/post";

interface TypeOfCompo {
    items: CompetitionType[];
    isFetch?: boolean;
    type?: string;
}

export function BoardTable({ items, isFetch = false, type = 'live' }: TypeOfCompo) {
    const [visibleCount, setVisibleCount] = useState(10);


    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };
    const handleLoadLess = () => {
        setVisibleCount((prev) => prev - 10);
    };

    const visibleData = items.slice(0, visibleCount);

    return (
        <Card className="py-0">
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow className="h-12">
                        <TableHead className="text-end">เจ้าบ้าน</TableHead>
                        <TableHead className="w-30 text-center"></TableHead>
                        <TableHead className="text-start">ทีมเยือน</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isFetch ? (visibleData.map((item, index) => (
                        <React.Fragment key={index}>
                            <TableRow className="bg-primary/20">
                                <TableCell colSpan={3}>
                                    <div className="flex gap-2">
                                        <span className="text-xs">{item.name}</span>
                                        {/* {item.countries.map((country, indexkey) => (
                                            <span key={indexkey} className="flex gap-2  items-center">
                                                <img
                                                    src={`/flag?type=country&id=${country.id}`}
                                                    className="h-2 w-4"
                                                />
                                                <span className="text-xs sr-only">{country.name}</span>
                                            </span>
                                        ))} */}

                                    </div>
                                </TableCell>
                            </TableRow>
                            {item.matches?.map((match, key) => {
                                return (
                                    <React.Fragment key={'match' + key}>
                                        <TableRow>
                                            <TableCell>
                                                <TableCellViewer item={match} className="w-full h-14">
                                                    <div className="flex justify-between">
                                                        {match.country?.id ? (
                                                            <img
                                                                src={`/flag?type=country&id=${match.country.id}`}
                                                                className="h-3 w-5"
                                                            />
                                                        ) : (<span></span>)}
                                                        <div className="flex gap-2  justify-end  items-center ">
                                                            <span className={cn("line-clamp-1 hidden md:block", whoWon(match.scores?.score || '?-?') == '1' ? 'text-success' : whoWon(match.scores?.score || '?-?') == '2' && 'text-red-700')}>{match.home.name}</span>
                                                            <span className={cn("line-clamp-1 md:hidden", whoWon(match.scores?.score || '?-?') == '1' ? 'text-success' : whoWon(match.scores?.score || '?-?') == '2' && 'text-red-700')}>{ShortName(match.home.name)}.</span>
                                                            <img src={match.home.logo} alt={match.home.logo} className="size-4" />
                                                        </div>
                                                    </div>
                                                </TableCellViewer>
                                            </TableCell>
                                            <TableCell>
                                                <TableCellViewer item={match} className="w-full h-full">
                                                    <div className="flex flex-col justify-center items-center gap-2">
                                                        {match.odds?.pre?.[1] && match.odds.pre[2] && match.odds.pre['X'] && (
                                                            <div className="flex items-center justify-center gap-4">
                                                                <span>{match.odds?.pre?.[1]}</span>
                                                                <span>{match.odds?.pre?.['X']}</span>
                                                                <span>{match.odds?.pre?.[2]}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex">
                                                            <span className="text-xs  rounded-full  bg-foreground  text-background  px-2">{match.scores?.score || '?-?'}</span>
                                                        </div>
                                                    </div>
                                                </TableCellViewer>
                                            </TableCell>
                                            <TableCell>
                                                <TableCellViewer item={match} className="w-full h-14">
                                                    <div className="flex justify-between">
                                                        <div className="flex gap-2 items-center">
                                                            <img src={match.away.logo} alt={match.away.logo} className="size-4" />
                                                            <span className={cn("line-clamp-1 hidden md:block", whoWon(match.scores?.score || '?-?') == '2' ? 'text-success' : whoWon(match.scores?.score || '?-?') == '1' && 'text-red-700')}>{match.away.name}</span>
                                                            <span className={cn("line-clamp-1 md:hidden", whoWon(match.scores?.score || '?-?') == '2' ? 'text-success' : whoWon(match.scores?.score || '?-?') == '1' && 'text-red-700')}>{ShortName(match.away.name)}.</span>
                                                        </div>
                                                        {type == 'live' ? (
                                                            <MatcTimehBadge item={match} />
                                                        ) : (
                                                            <span className="text-muted-foreground">{convertUTC(match.date || new Date().toISOString(), match.time, 7, 'time')} น.</span>
                                                        )}
                                                    </div>
                                                </TableCellViewer>
                                            </TableCell>
                                        </TableRow>
                                        {
                                            match.posts && match.posts?.length > 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="">
                                                        <div className="flex gap-2 max-h-8">
                                                            {
                                                                match.posts.map((post: PostType) => (
                                                                    <Link href={route_post.view(post.id).url} className="size-6 rounded-full overflow-hidden">
                                                                        <Avatar>
                                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </React.Fragment>
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

            <div className="mt-4 flex flex-col items-center justify-center gap-2">
                {visibleCount < items.length ? (
                    <>
                        <span className="text-ring text-sm">ยังมีอีก {items.length - visibleCount} ทีมที่กำลังแข่งขัน</span>
                        <div className="flex gap-2">
                            {visibleCount > 20 && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>}
                            <Button onClick={handleLoadMore}>แสดงเพิ่ม</Button>
                        </div>
                    </>
                ) : (visibleCount == items.length && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>)}
            </div>
        </Card>
    )
}
