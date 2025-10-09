import { ExpertBadge } from "@/components/expert-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { ContentForSale, Podium } from "@/pages/posts/view";
import dash from "@/routes/dash";
import web from "@/routes/web";
import { BreadcrumbItem } from "@/types";
import { MatchType } from "@/types/match";
import { PostType } from "@/types/post";
import { UserGuast, UserRankType } from "@/types/user";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";



export default function PostSummaryPage(request: any) {
    console.log(request);

    const [post, setPost] = useState<PostType>(request.post as PostType);
    const [match, setMatch] = useState<MatchType>(post.match as MatchType);
    const [user, setUser] = useState<UserGuast>(post.user as UserGuast);
    const [rank, setRank] = useState<UserRankType>(user.rank as UserRankType);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: post.title,
            href: dash.admin.post.summary({ id: post.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 items-center justify-center">

                    <div className="w-full flex gap-2 justify-between">
                        <div className="flex gap-2 text-muted-foreground">
                            <span className="text-primary">{post.type_text}</span>
                            {match.country ? (<span>{match.country?.name}</span>) : null}
                            {match.federation && (<span>{match.federation.name_th ?? match.federation.name}</span>)}
                            <span>{match.date_th_short?.replaceAll("-", "/")}</span>
                            <span>{match.time.slice(0, 5)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4  items-center w-full">
                        <Link href={web.match.view({ id: match.id }).url} className="w-full">
                            <div className="w-full flex gap-4 justify-center items-center">
                                <div className="w-full flex justify-end"><Podium item={match.home} logo_position="end" /></div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-base md:text-xl font-bold  text-nowrap">{match.scores?.score}</span>
                                </div>
                                <div className="w-full flex justify-start"><Podium item={match.away} /></div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-sm">
                        <ContentForSale item={post} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <Card className="w-full px-4">
                        <div className="grid grid-cols-2">
                            <div className="flex gap-2 items-center">
                                <Avatar>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="capitalize">{user.username.charAt(1)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user.name}</span>
                                {rank.level !== 0 && (
                                    <ExpertBadge level={rank.level} type={rank.type_text} />
                                )}
                                <span>{post.result_text}</span>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
