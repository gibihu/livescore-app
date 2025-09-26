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


type Type = {
    className?: string;
    classPopover?: string;
    onChange?: (file: File | null) => void;
    select_id?: number;
};


export function PickMatch({ select_id, className, onChange, classPopover }: Type) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [id, setId] = React.useState<Number>();
    const [fixtures, setFixtures] = React.useState<MatchType[]>([]);
    const [isFetch, setIsFetch] = React.useState<boolean>(true);


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
                handelNextStep();
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

    function handelNextStep() {
        const fetchData = async () => {
            setIsFetch(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(api.match.live().url);

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data;

                // กรองข้อมูลที่มี fixture_id เป็น 0 หรือ null ออกไป
                const validData = data.filter((item: MatchType) =>
                    item.fixture_id && item.fixture_id !== 0
                );

                const newData = validData.map((item: MatchType) => ({
                    ...item,
                    id: item.fixture_id,
                }));

                setFixtures(prev => {
                    // update element เดิม
                    const updatedPrev = prev.map(m =>
                        newData.some((d: any) => d.id === m.id)
                            ? { ...m, ...newData.find((d: any) => d.id === m.id) }
                            : m
                    );

                    // เพิ่ม element ใหม่ที่ยังไม่มี
                    const newItems = newData.filter((d: any) => !prev.some(m => m.id === d.id));

                    return [...updatedPrev, ...newItems];
                });
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsFetch(false);
            setId(Number(select_id));
        };
        fetchData();
    }


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
                        const item = fixtures.find(item => item.id === id);
                        return item ? (
                            <div className="w-full flex justify-center gap-2">
                                <div className="flex gap-2 w-full justify-end">
                                    <span>{item.home.name}</span>
                                    <img src={item.home.logo} alt={item.home.logo} className="size-4" />
                                </div>
                                <span>vs</span>
                                <div className="flex gap-2 w-full">
                                    <img src={item.away.logo} alt={item.away.logo} className="size-4" />
                                    <span>{item.away.name}</span>
                                </div>
                            </div>
                        ) : <span className="w-full text-center">Select Team...</span>;
                    })()
                        : isFetch ? <LoaderCircle className="size-3 animate-spin" /> : <span className="w-full text-center">Select Team...</span>}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className={cn(" w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl p-0", classPopover)}>
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandGroup>
                            {!isFetch ? (fixtures.length > 0 ? fixtures.map((item: MatchType, index) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.home.name + ' vs ' + item.away.name}
                                    onSelect={() => {
                                        setId(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="w-full flex justify-center gap-2">
                                        <div className="flex gap-2 w-full justify-end">
                                            <span>{item.home.name}</span>
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
                            )) : (
                                <CommandEmpty className="w-full">No framework found.</CommandEmpty>
                            )) : (
                                <CommandEmpty>
                                    <LoaderCircle className="animate-spin size-4 w-full" />
                                </CommandEmpty>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
