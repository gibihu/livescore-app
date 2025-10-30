import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/layout";
import test from "@/routes/test";
import web from "@/routes/web";
import { StageType, StandingType } from "@/types/match";
import { Head, Link } from "@inertiajs/react";


export default function Standing(request: any) {

    console.log(request);
    const stages = request.stages as StageType[];

    return (
        <AppLayout>
            <Head title="ประวัติ" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                {stages && stages.length > 0 ? (
                    <Tabs defaultValue={stages[0].id}>
                        <TabsList>
                            {stages.map((item: StageType) => (
                                <TabsTrigger key={item.id} value={item.id}>
                                    {item.competition.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {stages.map((item: StageType) => (
                            <TabsContent key={item.id} value={item.id}>
                                <Card>
                                    <StandingTable items={item} />
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    <span className="text-muted-foreground">
                        <Link href={test.standing().url} >ไม่มีข้อมูล</Link>
                    </span>
                )}
            </div>
        </AppLayout>
    );
}


function StandingTable({ items }: { items: StageType }) {
    const standings = items.group.standing;
    const sortedStandings = [...standings].sort((a, b) => a.rank - b.rank);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>อันดับทีม</TableHead>
                    <TableHead className="text-center">แข่ง</TableHead>
                    <TableHead className="text-center">ชนะ</TableHead>
                    <TableHead className="text-center">เสมอ</TableHead>
                    <TableHead className="text-center">แพ้</TableHead>
                    <TableHead className="text-center">ได้</TableHead>
                    <TableHead className="text-center">เสีย</TableHead>
                    <TableHead className="text-center">+/-</TableHead>
                    <TableHead className="text-center">คะแนน</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedStandings.map((item: StandingType) => (
                    <TableRow>
                        <TableCell>
                            <Link href={web.team.item({ id: item.team_id })}>
                                <div className="flex gap-2 items-center">
                                    <Avatar className="size-5">
                                        <AvatarImage src={item.team.logo} />
                                        <AvatarFallback className="animate-pulse" />
                                    </Avatar>
                                    {item.team.name}
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell className="text-center">{item.matches}</TableCell>
                        <TableCell className="text-center">{item.won}</TableCell>
                        <TableCell className="text-center">{item.drawn}</TableCell>
                        <TableCell className="text-center">{item.lost}</TableCell>
                        <TableCell className="text-center">{item.goals_scored}</TableCell>
                        <TableCell className="text-center">{item.goals_conceded}</TableCell>
                        <TableCell className="text-center">{item.goal_diff}</TableCell>
                        <TableCell className="text-center">{item.points}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
