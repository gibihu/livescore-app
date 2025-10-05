import { AppCoins } from "@/components/app-icon";
import { Countdown } from "@/components/functions";
import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/layout";
import web from "@/routes/web";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import { UserGuast } from "@/types/user";
import { Head, Link } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { Podium } from "../posts/view";

export default function ShowMatch(request: any) {

    console.log(request);

    const [match, setMatch] = useState<MatchType>(request.match);

    const someDate = match.date_th_short || match.added_th_short;


    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />

                <Card>
                    <div className="w-full flex gap-4 justify-center items-center">
                        <div className="w-full flex justify-end"><Podium item={match.home} logo_position="end" /></div>
                        <div className="flex flex-col gap-2">
                            <span className=" flex flex-col gap-0 text-sm md:text-xl font-bold text-nowrap text-center">
                                {match.scores ? (
                                    <>
                                        <span>{match.scores.score}</span>
                                        <span className="text-xs fonct-base text-muted-foreground">{someDate?.slice(0, 4).replaceAll("-", "/") + ' | ' + match.scheduled?.slice(0, 5)}</span>
                                    </>
                                ) : (
                                    match.scheduled ? (
                                        <>
                                            <span>{match.scheduled}</span>
                                            <span className="text-xs fonct-base text-muted-foreground">{someDate?.slice(0, 4).replaceAll("-", "/") + ' | ' + match.scheduled?.slice(0, 5)}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Countdown date={match.date ?? ''} time={match.time} />
                                            <span className="text-xs fonct-base text-muted-foreground">{someDate?.slice(0, 4).replaceAll("-", "/") + ' | ' + match.time.slice(0, 5)}</span>
                                        </>
                                    )
                                )}
                            </span>
                        </div>
                        <div className="w-full flex justify-start"><Podium item={match.away} /></div>

                    </div>
                </Card>

                <ContentTabs request={request} />

            </div>
        </AppLayout>
    );
}

function ContentTabs({ request }: { request: any }) {
    const posts = request.posts as PostType[];
    const match = request.match as MatchType;
    return (
        <Tabs defaultValue="post" className="w-full">
            <TabsList>
                <TabsTrigger value="post">ทีเด็ด</TabsTrigger>
                <TabsTrigger value="players">นักเตะ</TabsTrigger>
                {match.live_status === "LIVE" || match.live_status === "END_LIVE" ? (
                    <TabsTrigger value="lineups">ตัวจริง</TabsTrigger>
                ) : null}
            </TabsList>
            <div className="p-0 md:p-4">
                <TabsContent value="post" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.length > 0 ? (posts.map((post: PostType) => (
                        <PostCard item={post} key={post.id} />
                    ))) : (
                        <span>ไม่มีข้อมูล</span>
                    )}
                </TabsContent>
                <TabsContent value="players">ข้อมูลนักเตะ</TabsContent>
                <TabsContent value="lineups">ข้อมูลนักเตะตัวจริง</TabsContent>
            </div>
        </Tabs>
    );
}



function ContentPosts({ post }: { post: PostType }) {
    return (
        <></>
    );
}

function PostCard({ item }: { item: any }) {
    const user = item.user as UserGuast;
    return (
        <Link href={web.post.view({id: item.id}).url}>
            <Card className="gap-1 py-4">
                <CardHeader>
                    <CardTitle className="line-clamp-1 text-sm  flex gap-2 items-center">
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="capitalize">{user.username.charAt(1)}</AvatarFallback>
                        </Avatar>
                        <span className="font-normal">{user.name}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    {item.title}
                </CardContent>
                <CardFooter className="flex gap-2 justify-between text-sm text-muted-foreground">
                    <span>views</span>
                    <div className="flex gap-2 items-center">
                        <span>{item.type_text}</span>
                        <span>|</span>
                        <div className="flex gap-1 items-center">
                            <AppCoins /> <span className="text-foreground">{item.points.toLocaleString()}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
