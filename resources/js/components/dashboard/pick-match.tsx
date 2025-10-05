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
    onChange?: (target: string | null | undefined) => void;
    select_id?: string;
    data: {
        matches: MatchType[],
        leagues: CompetitionType[];
    }
};


const ITEMS_PER_PAGE = 30;

export function PickMatch({ select_id, className, onChange, classPopover, data }: Type) {
    const [open, setOpen] = React.useState(false);
    const initialId = React.useMemo(() => {
        if (!select_id) return '';

        // ตรวจสอบว่า select_id มีอยู่ใน matches หรือไม่
        const exists = data.matches.some(match => match.id === select_id);
        return exists ? select_id : '';
    }, [select_id, data]);
    const [id, setId] = React.useState<string>(initialId);
    const [isFetch, setIsFetch] = React.useState<boolean>(true);
    const [items, setItems] = React.useState<CompetitionType[]>([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [displayCount, setDisplayCount] = React.useState(ITEMS_PER_PAGE);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (data.leagues && data.leagues.length > 0) {
            const sortedLeagues = [...data.leagues].sort((a, b) => a.tier - b.tier);

            const updatedFilters = sortedLeagues.map((league: CompetitionType) => {
                const leagueMatches = (data.matches || [])
                    .filter((match) => match.league && match.league.id === league.id)
                    .sort((a: any, b: any) => new Date(a.added).getTime() - new Date(b.added).getTime());

                return {
                    ...league,
                    matches: leagueMatches,
                };
            });

            setItems(updatedFilters);
            setTimeout(() => {
                setIsFetch(false);
            }, 1000);
        }
    }, [data]);

    React.useEffect(()=>{
        const exists = data.matches.some(match => match.id === select_id);
        onChange?.(exists ? select_id : null);
    }, []);

    // Reset display count when search changes
    React.useEffect(() => {
        setDisplayCount(ITEMS_PER_PAGE);
    }, [searchValue]);

    // Get all matches flattened
    const allMatches = React.useMemo(() => {
        return items.flatMap(league =>
            (league.matches || []).map(match => ({
                ...match,
                leagueName: league.name
            }))
        );
    }, [items]);

    // Filter matches based on search
    const filteredMatches = React.useMemo(() => {
        if (!searchValue) return allMatches;

        const search = searchValue.toLowerCase();
        return allMatches.filter(match =>
            match.home.name.toLowerCase().includes(search) ||
            match.away.name.toLowerCase().includes(search) ||
            match.leagueName.toLowerCase().includes(search)
        );
    }, [allMatches, searchValue]);

    // Get matches to display
    const displayedMatches = React.useMemo(() => {
        // If searching, show all filtered results
        if (searchValue) return filteredMatches;

        // Otherwise, show limited results
        return allMatches.slice(0, displayCount);
    }, [allMatches, filteredMatches, displayCount, searchValue]);

    // Group displayed matches by league
    const groupedMatches = React.useMemo(() => {
        const groups: { [key: string]: { name: string; matches: any[] } } = {};

        displayedMatches.forEach((match: any) => {
            if (!groups[match.league.id]) {
                groups[match.league.id] = {
                    name: match.leagueName,
                    matches: []
                };
            }
            groups[match.league.id].matches.push(match);
        });

        return Object.values(groups);
    }, [displayedMatches]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        // Don't paginate when searching
        if (searchValue) return;

        const target = e.currentTarget;
        const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

        if (bottom && displayCount < allMatches.length) {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, allMatches.length));
        }
    };

    const selectedMatch = data.matches.find(item => item.id === id);
    const hasMore = !searchValue && displayCount < allMatches.length;

    console.log(groupedMatches);
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
                    {id && id.length > 0 ? (
                        selectedMatch ? (
                            <div className="w-full flex justify-center gap-2">
                                <div className="flex gap-2 w-full justify-end">
                                    <span className="text-end">{selectedMatch.home.name}</span>
                                    <img src={selectedMatch.home.logo} alt={selectedMatch.home.name} className="size-4" />
                                </div>
                                <span>vs</span>
                                <div className="flex gap-2 w-full">
                                    <img src={selectedMatch.away.logo} alt={selectedMatch.away.name} className="size-4" />
                                    <span>{selectedMatch.away.name}</span>
                                </div>
                            </div>
                        ) : (
                            <span className="w-full text-center">รอสักครู่...</span>
                        )
                    ) : isFetch ? (
                        <LoaderCircle className="size-3 animate-spin" />
                    ) : (
                        <span className="w-full text-center">Select Team...</span>
                    )}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className={cn("w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl p-0", classPopover)}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search match..."
                        className="h-9"
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList onScroll={handleScroll} ref={scrollRef}>
                        {groupedMatches.length > 0 ? (
                            <>
                                {groupedMatches.map((group, index) => (
                                    <CommandGroup
                                        heading={<div className="w-full text-center pe-6">{group.name}</div>}
                                        key={index}
                                    >
                                        {group.matches.map((match: any) => (
                                            <CommandItem
                                                key={match.id}
                                                value={match.home.name + ' vs ' + match.away.name}
                                                onSelect={() => {
                                                    setId(match.id);
                                                    onChange?.(match.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <div className="w-full flex justify-center gap-2">
                                                    <div className="flex gap-2 w-full justify-end">
                                                        <span className="text-end">{match.home.name}</span>
                                                        <img src={match.home.logo} alt={match.home.name} className="size-4" />
                                                    </div>
                                                    <span>vs</span>
                                                    <div className="flex gap-2 w-full">
                                                        <img src={match.away.logo} alt={match.away.name} className="size-4" />
                                                        <span>{match.away.name}</span>
                                                    </div>
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        id === match.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}
                                {hasMore && (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        <LoaderCircle className="size-4 animate-spin mx-auto" />
                                    </div>
                                )}
                                {!hasMore && !searchValue && allMatches.length > ITEMS_PER_PAGE && (
                                    <div className="py-2 text-center text-sm text-muted-foreground">
                                        แสดงครบทั้งหมดแล้ว ({allMatches.length} รายการ)
                                    </div>
                                )}
                            </>
                        ) : (
                            <CommandEmpty>ไม่พบรายการที่ค้นหา</CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
