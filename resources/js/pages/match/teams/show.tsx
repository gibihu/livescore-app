import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import AppLayout from "@/layouts/layout";
import { TeamType } from "@/types/match";
import { Head } from "@inertiajs/react";

export default function TeamPage(request: any){
    console.log(request);
    return(
        <AppLayout>
            <Head title="Home" />
            <NavBar />
            <div className="flex flex-col gap-4  mt-4">
                <MenuBar />
                <Card className="px-4">
                    <StadeamTeam item={request.team} />
                </Card>
            </div>
        </AppLayout>
    );
}

function StadeamTeam({item}:{item: TeamType}){
    return(
        <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-2 items-center justify-center">
                <Avatar className="size-24">
                    <AvatarImage src={item.logo} alt={item.name} />
                    <AvatarFallback className="animate-pulse" />
                </Avatar>
                <p className="text-xl font-bold">{item.name}</p>
            </div>

        </div>
    );
}
