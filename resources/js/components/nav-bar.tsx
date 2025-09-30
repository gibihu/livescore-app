import { AuthType } from "@/types/auth";
import { UserType } from "@/types/user";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { CirclePoundSterling } from "lucide-react";
import { login, logout } from "@/routes";
import web from "@/routes/web";




const API_NAME: string = import.meta.env.VITE_APP_NAME;
export default function NavBar(){

    // usePage();

    const auth: AuthType = usePage().props.auth as AuthType;
    const user = auth.user as UserType;

    return (
        <>
            <div className="w-full flex gap-2 justify-between items-center rounded-xl bg-foreground text-background  shadow-xl p-4">
                <Link href={web.home().url} prefetch>
                    <h4 className="text-xl font-bold capitalize">{API_NAME}</h4>
                </Link>
                <div className="flex gap-2 items-center">
                    { user ? (
                        user.role && (
                            <>
                                <div className="flex gap-2">
                                    <Button variant='ghost'>
                                        <CirclePoundSterling className="size-4 text-yellow-600" />
                                        <span>{user.wallet.points.toLocaleString()}</span>
                                    </Button>
                                </div>
                                <Link href="/dashboard"><Button asChild><span>Dashboard</span></Button></Link>
                                <Link href={logout()} as="button"><Button asChild><span>ออระบบ</span></Button></Link>
                            </>
                        )
                    ) : (
                        <Link href={login().url}><Button>Sign in</Button></Link>
                    )}
                </div>
            </div>
        </>
    );
}
