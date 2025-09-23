import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SelectPackpointProps = {
    onChange?: (id: string) => void;
    onSubmit?: (id: string | null) => void;
    disabled?: boolean;
};

interface PackageType {
    id: string;
    points: number;
    price: number;
    price_per_points: number;
}
export default function SelectPackpoint({ onChange, onSubmit, disabled }: SelectPackpointProps) {
    const [items, setItems] = useState<PackageType[]>([]);
    const [selected, setSelected] = useState<string>('');

    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (!selected) setIsDisabled(true);
        if (disabled) setIsDisabled(true);
        if (selected) setIsDisabled(false);
    }, [disabled, selected]);

    const handleSelect = (id: string) => {
        // console.log(id);
        if (selected == id) {
            setSelected('');
            onChange?.('');
            setIsSelected(false);
        } else {
            setSelected(id);
            onChange?.(id);
            setIsSelected(true);
        }
    };

    const handleSubmit = () => {
        onSubmit?.(selected);
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsFetch(true);
            const res = await fetch(api.dash.point.packages().url);
            const result = await res.json();
            if (result.code == 200) {
                const data = result.data;
                setItems(data);
            } else {
                const errors = result;
                toast.error(result.message, { description: errors.detail || result.code || '' });
            }
            setIsFetch(false);
        };

        fetchData();
    }, []);



    return (
        <div className="space-y-4">
            {isFetch ? (
                <div className="flex justify-center items-center h-10 w-full">
                    <LoaderCircle className="animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-2">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.id)}
                                className='col-span-1'
                            >
                                <CardPoints item={item} selected={selected == item.id ? true : false} />
                            </div>
                        ))}
                    </div>

                    {/* <Button
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        variant="primary"
                        className="w-full"
                    >
                        เลือก
                    </Button> */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={isDisabled}
                                variant="primary"
                                className="w-full"
                            >
                                เลือก
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>คุณแน่ใจไหม</AlertDialogTitle>
                                <AlertDialogDescription>
                                    การสั่งซื้อของคุณจะเริ่มดำเนินการ
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>ปิด</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit}>ยืนยัน</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </div>
    );
}


function CardPoints({ item, selected = false }: { item: PackageType, selected?: boolean }) {
    return (
        <>
            <Card className={cn('cursor-pointer', selected ? 'border-yellow-600' : '')}>
                <CardHeader className="flex items-end justify-center">
                    <CardTitle className="text-yellow-600 fonct-bold text-4xl">{item.points}</CardTitle>
                    <CardDescription className="text-xs">พอยท์</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center">{item.price} บาท</p>
                </CardContent>
            </Card>
        </>
    );
}
