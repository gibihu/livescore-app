import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/layout";
import { cn } from "@/lib/utils";
import { home } from "@/routes";
import api from "@/routes/api";
import { PostType } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { CheckCircle, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";



const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
export default function Home(request: any) {
    const post = request.post as PostType;

    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [isFinish, setIsFinish] = useState<boolean>(false);


    const schema = z.object({
        description: z.string(),
        category: z.string().min(1, { message: "ต้องเลือกอย่างน้อยหนึ่งรายการ" }),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            description: "",
            category: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.post.report.create({ post_id: post.id }).url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (result.code === 201) {
                    setIsFinish(true);
                    toast.success(result.message);
                    setTimeout(() => {
                        router.visit(home().url);
                    }, 1000);
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
    };




    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />
            <div className="flex flex-col gap-4  mt-4">

                <Card className="relative p-0  overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2 md:px-4 md: py-6 ">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                <div className="col-span-2">
                                    <Popover>
                                        <PopoverTrigger asChild disabled={true}>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={false}
                                                className="w-full justify-between"
                                            >
                                                {post.title}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                    </Popover>
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>หมวดหมู่</FormLabel>
                                                <FormControl>
                                                    <SlectCategory fieldState={!!fieldState.error} {...field} disabled={isFetch} />
                                                </FormControl>
                                                {!fieldState.error && (
                                                    <FormDescription>
                                                        เลือกหนึ่งรายการจากตัวเลือก
                                                    </FormDescription>
                                                )}

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>รายละเอียด (ไม่บังคับ)</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={isFetch} />
                                                </FormControl>
                                                {!fieldState.error && (
                                                    <FormDescription>
                                                        เพิ่มรายละเอียดของการละเมิด
                                                    </FormDescription>
                                                )}

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-start-2 flex justify-end">
                                    <Button variant="destructive">รายงาน</Button>
                                </div>

                            </div>
                        </form>
                    </Form>
                    {isFinish && (
                        <div className="absolute inset-0 bg-card/80 flex flex-col justify-center items-center z-50">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="flex flex-col items-center "
                            >
                                {/* วงกลม */}
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 58 58"
                                    className="w-20 h-20 mb-4"
                                >
                                    <motion.circle
                                        cx="28"
                                        cy="28"
                                        r="25"
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <motion.path
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 30l7 7 17-17"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                    />
                                </motion.svg>

                                {/* ข้อความ */}
                                <p className="text-lg font-semibold text-primary">
                                    ขอบคุณที่แจ้งให้เราทราบ
                                </p>
                            </motion.div>

                        </div>
                    )}
                </Card>

            </div>
        </AppLayout>
    );
}


interface SelectCategoryProps {
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean,
    fieldState: boolean;
}
function SlectCategory({ value, onChange, disabled, fieldState }: SelectCategoryProps) {

    const mock = [
        {
            title: "หัวข้อ",
            items: [
                { value: "topic_is_bad", title: "หัวข้อมไม่เหมาะสม" },
                { value: "topic_is_porn", title: "หัวข้อมสื่อทางลามกอนาจาร" },
                { value: "topic_not_rule", title: "ผิดกฏชุมชน" },
            ]
        },
        {
            title: "เนื้อหา",
            items: [
                { value: "content_is_bad", title: "หัวข้อมไม่เหมาะสม" },
                { value: "content_is_porn", title: "หัวข้อมสื่อทางลามกอนาจาร" },
                { value: "content_not_rule", title: "ผิดกฏชุมชน" },
            ]
        },
    ];
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={cn("w-full line-clamp-1", fieldState && 'border border-destructive')}>
                <SelectValue placeholder="Select a timezone" className="" />
            </SelectTrigger>
            <SelectContent>
                {mock.map((item, index) => (
                    <SelectGroup key={index}>
                        <SelectLabel>{item.title}</SelectLabel>
                        {item.items.map((tiny, key) => (
                            <SelectItem key={index + '_' + key} value={tiny.value}>{tiny.title}</SelectItem>
                        ))}
                    </SelectGroup>
                ))}
            </SelectContent>
        </Select>
    );
}
