import MenuBar from "@/components/menu-bar";
import NavBar from "@/components/nav-bar";
import AppLayout from "@/layouts/layout";
import { Head } from "@inertiajs/react";
import { LiveScore } from "../live-score";
import { useEffect, useState } from "react";
import { MatchType } from "@/types/match";
import { toast } from "sonner";
import api from "@/routes/api";
import { Favorite } from "@/models/favorite";
import { Input } from "@/components/ui/input";

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
export default function FavoritePage(request: any){
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [filteredMatches, setFilteredMatches] = useState<MatchType[]>([]);
    const [input, setInput] = useState<string>("");
    const fav = Favorite.get().filter(item => item.status == "atctive").map(item => item.match_id);
    console.log(fav);

    useEffect(()=>{
        const fetchData = async () => {
            try{
                setIsFetch(true);
                const res = await fetch(api.match.favorite().url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        items: fav,

                    })
                });

                const result = await res.json();
                if(result.code == 200){
                    setMatches(result.data);
                }else{
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                let message = "เกิดข้อผิดพลาดบางอย่าง";

                if (error instanceof Error) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                }

                toast.error(message);
            } finally {
                setIsFetch(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const keyword = input?.trim();

        if (!keyword) {
            setFilteredMatches(matches);
            return;
        }

        // ทำให้ค้นหาไม่สนตัวพิมพ์เล็กใหญ่ และรองรับภาษาไทย
        const lower = keyword.toLowerCase();

        const result = matches.filter((m) => {
            const home = m.home.name?.toLowerCase() || "";
            const away = m.away.name?.toLowerCase() || "";

            return home.includes(lower) || away.includes(lower);
        });

        setFilteredMatches(result);

    }, [input, matches]);

    return(
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <MenuBar>
                    <Input
                        className="max-w-full sm:max-w-xs"
                        placeholder="ค้นหาทีม"
                        onChange={e => setInput(e.target.value)}
                    />
                </MenuBar>
                <LiveScore match_items={filteredMatches} isFetch={isFetch}  />
            </div>
        </AppLayout>
    );
}
