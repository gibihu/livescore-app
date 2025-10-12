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
import { useState } from "react";
import { Podium } from "../posts/view";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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
        <Tabs defaultValue="index" className="w-full">
            <TabsList>
                <TabsTrigger value="index">ทีเด็ด</TabsTrigger>
                <TabsTrigger value="post">ทีเด็ด</TabsTrigger>
                <TabsTrigger value="players">นักเตะ</TabsTrigger>
                {match.live_status === "LIVE" || match.live_status === "END_LIVE" ? (
                    <TabsTrigger value="lineups">ตัวจริง</TabsTrigger>
                ) : null}
            </TabsList>
            <div className="p-0 md:p-4">
                <TabsContent value="index"><FootballField item={[]} /></TabsContent>
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
        <Link href={web.post.view({ id: item.id }).url}>
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


function FootballField({ item }: { item: any[] }) {

    const mock = [
        {
            user: {
                name: 'JJJ',
                avatar: 'https://github.com/shadcn.png'
            },
            content: '555+'
        },
        {
            user: {
                name: 'JJJ',
                avatar: 'https://github.com/shadcn.png'
            },
            content: '555+'
        },
        {
            user: {
                name: 'JJJ',
                avatar: 'https://github.com/shadcn.png'
            },
            content: ' asld kaskm dklansk ldnaklsn ldnakl sndkl naskl ndklasn kldasn kldakls kldmaklsn daslk'
        },
    ];

    return (
        <div className="grid grid-cols-5 gap-2">
            <Card className="col-span-3 p-0 overflow-hidden">
                <div className="flex flex-col gap-4">
                    {/* <div className="w-full h-50  bg-border animate-pulse"></div> */}
                    <Tooltip>
                        <TooltipTrigger>
                            <Skeleton className="w-full h-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>สนาม</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Skeleton className="w-full h-20" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>กราฟ</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </Card>
            <Card className="col-span-2 pb-0">
                <div className="flex flex-col h-full">
                    <div className="flex flex-col gap-3 h-full px-2">
                        {mock.map((item: any, key: any) => (
                            <ChatItem item={item} key={key} />
                        ))}
                    </div>
                    <ChatInputArea />
                </div>
            </Card>
        </div>
    );
}


function ChatInputArea() {
    const [message, setMessage] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
            // ส่งข้อความ
            console.log("ส่งข้อความ:", message);
            setMessage(""); // ล้าง textarea
        }
        // ถ้า Shift+Enter จะปล่อยให้ขึ้นบรรทัดใหม่ตามปกติ
    };

    return (
        <div className="flex items-center p-2">
            <Textarea
                placeholder="แสดงความคิดเห็น..."
                className="resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

function ChatItem({ item }: { item: any }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="flex gap-1 items-center">
                <Avatar className="size-6">
                    <AvatarImage src={item.user.avatar} />
                    <AvatarFallback className="bg-border animate-pulse" />
                </Avatar>
                <span className="text-sm text-muted-foreground">{item.user.name}</span>
            </div>
            <span className="text-wrap">{item.content}</span>
        </div>
    );
}
