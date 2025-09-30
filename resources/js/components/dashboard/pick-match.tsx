import * as React from "react"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { MatchType } from "@/types/match"
import api from "@/routes/api"
import { toast } from "sonner"
import { CompetitionType } from "@/types/league"


type Type = {
    className?: string;
    classPopover?: string;
    onChange?: (target: number | null) => void;
    select_id?: number;
    data: {
        matches: MatchType[],
        leagues: CompetitionType[];
    }
};


export function PickMatch({ select_id, className, onChange, classPopover, data }: Type) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [id, setId] = React.useState<Number>();
    const [fixtures, setFixtures] = React.useState<MatchType[]>([]);
    const [isFetch, setIsFetch] = React.useState<boolean>(true);
    const [items, setItems] = React.useState<CompetitionType[]>();


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.match.fixture().url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setFixtures(data);
                } else {
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
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        if (data.leagues && data.leagues.length > 0) {
            // เรียง leagues ตาม tier จากน้อยไปมาก
            const sortedLeagues = [...data.leagues].sort((a, b) => a.tier - b.tier);

            const updatedFilters = sortedLeagues.map((league: CompetitionType) => {
                // หา matches ของ league นี้
                const leagueMatches = (data.matches || [])
                    .filter((match) => match.competition && match.competition.id === league.id)
                    // เรียง matches ตาม added (ใหม่ -> เก่า) ถ้าอยากเก่า -> ใหม่ ให้เปลี่ยน b - a
                    .sort((a: any, b: any) => new Date(a.added).getTime() - new Date(b.added).getTime());

                return {
                    ...league,
                    matches: leagueMatches, // จะเป็น array ว่างถ้าไม่มี matches
                };
            });

            setItems(updatedFilters);
            // console.log(updatedFilters);
        }
    }, [fixtures]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    disabled={isFetch}
                >
                    {id ? (() => {
                        const item = data.matches.find(item => item.id === id);
                        return item ? (
                            <div className="w-full flex justify-center gap-2">
                                <div className="flex gap-2 w-full justify-end">
                                    <span className="text-end">{item.home.name}</span>
                                    <img src={item.home.logo} alt={item.home.logo} className="size-4" />
                                </div>
                                <span>vs</span>
                                <div className="flex gap-2 w-full">
                                    <img src={item.away.logo} alt={item.away.logo} className="size-4" />
                                    <span>{item.away.name}</span>
                                </div>
                            </div>
                        ) : <span className="w-full text-center">รอสักครู่...</span>;
                    })()
                        : isFetch ? <LoaderCircle className="size-3 animate-spin" /> : <span className="w-full text-center">Select Team...</span>}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className={cn(" w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl p-0", classPopover)}>
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        {items?.map((league: CompetitionType) => (
                            <CommandGroup heading={<div className="w-full text-center pe-6">{league.name}</div>} key={league.id}>
                                {league.matches?.map((item: MatchType) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.home.name + ' vs ' + item.away.name}
                                        onSelect={() => {
                                            setId(item.id);
                                            onChange?.(item.id);
                                            setOpen(false);
                                            // console.log(item.id);
                                        }}
                                    >
                                        <div className="w-full flex justify-center gap-2">
                                            <div className="flex gap-2 w-full justify-end">
                                                <span className="text-end">{item.home.name}</span>
                                                <img src={item.home.logo} alt={item.home.logo} className="size-4" />
                                            </div>
                                            <span>vs</span>
                                            <div className="flex gap-2 w-full">
                                                <img src={item.away.logo} alt={item.away.logo} className="size-4" />
                                                <span>{item.away.name}</span>
                                            </div>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                id === item.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                        <CommandEmpty >No framework found.</CommandEmpty>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
