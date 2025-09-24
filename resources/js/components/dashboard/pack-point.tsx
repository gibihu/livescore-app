import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/routes/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ca } from "zod/v4/locales";

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
    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
            setIsLoading(true);
            const res = await fetch(api.dash.point.packages().url);
            const result = await res.json();
            if (result.code == 200) {
                const data = result.data;
                setItems(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);


    function handleGenerate(){
        const fetchData = async () => {
            try{
                setIsFetch(true);
                const res = await fetch(api.dash.point.generate().url);
                const result = await res.json();
                if (result.code == 200) {
                    const data = result.data;
                    setItems(data);
                    toast.success('สร้างแพ็คเกจสำเร็จ');
                } else {
                    const errors = result;
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
    }



    return (
        <div className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-10 w-full">
                    <LoaderCircle className="animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-2">
                        {items.length > 0 ? items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.id)}
                                className='col-span-1'
                            >
                                <CardPoints item={item} selected={selected == item.id ? true : false} />
                            </div>
                        )) : (
                            <div className="col-start-2 col-span-2 flex justify-center">
                                <Button onClick={handleGenerate} disabled={isFetch} variant="outline" className="w-full">
                                    {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                    Generate
                                </Button>
                            </div>
                        )}
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
