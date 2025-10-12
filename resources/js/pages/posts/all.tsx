import { AppCoins } from "@/components/app-icon";
import { ExpertBadge } from "@/components/expert-badge";
import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/layout";
import web from "@/routes/web";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import { UserGuast, UserRankType, UserSeasonType } from "@/types/user";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Home(request: any) {
    const [posts, setPosts] = useState<PostType[]>(request.posts as PostType[]);

    console.log(request);

    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post: PostType) => (
                        <Link href={web.post.view({ id: post.id }).url} key={post.id}>
                            <PostCard item={post} />
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}


function PostCard({ item }: { item: any }) {
    const user = item.user as UserGuast;
    const match = item.match as MatchType;
    const ss = item.season as UserSeasonType;
    const rank = user.rank as UserRankType;
    return (
        <Card className="gap-1 py-4">
            <CardHeader>
                <CardTitle className="line-clamp-1 text-sm  flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="capitalize">{user.username.charAt(1)}</AvatarFallback>
                    </Avatar>
                    <span className="font-normal">{user.name}</span>
                    <ExpertBadge item={user} />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                        <span className="text-foreground font-bold text-end">{match.home.name}</span>
                        <Avatar className="size-4">
                            <AvatarImage src={match.home.logo} />
                            <AvatarFallback className="animate-pulse"></AvatarFallback>
                        </Avatar>
                    </div>
                    <span className="text-muted-foreground">vs</span>
                    <div className="flex gap-2 items-center">
                        <Avatar className="size-4">
                            <AvatarImage src={match.away.logo} />
                            <AvatarFallback className="animate-pulse"></AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-bold">{match.away.name}</span>
                    </div>
                </div>
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
    );
}
