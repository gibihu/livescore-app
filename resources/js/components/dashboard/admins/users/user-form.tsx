import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/routes/api";
import { UserRankType, UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function UserFrom({ request }: { request: any }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const [user, setUser] = useState<UserType>(request.user || {} as UserType);
    const [rank, setRank] = useState<UserRankType>(request.user.rank || {} as UserRankType);

    const [isFetch, setIsFetch] = useState<boolean>(false);

    const schema = z.object({
        name: z.string().min(1, { message: "กรุณาใส่ชื่อ" }).max(48, { message: 'ความยาวต้องไม่เกิน 48 ตัวอักษร' }),
        username: z.string().min(1, { message: "กรุณาใส่ชื่อ" }).max(48, { message: 'ความยาวต้องไม่เกิน 48 ตัวอักษร' }),
        email: z.email().min(1, { message: "กรุณาใส่ชื่อ" }).max(48, { message: 'ความยาวต้องไม่เกิน 48 ตัวอักษร' }),
        email_verified: z.boolean(),
        role: z.number(),
        custom_rate: z.number({ message: "กรอกได้แค่จัวเลขเท่านั้น" }).max(50, { message: "กรอกได้ไม่เกิน 50%" }),
        error_message: z.string().optional(),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            email_verified: user.email_verified_at ? true : false,
            role: user.role || 1,
            custom_rate: Number(user.custom_rate) || 0,
            error_message: '',
        },
        mode: "onChange",
    });
    const email_verified = user.email_verified_at ? true : false;


    function handleSubmit(data: FormValues) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(api.dash.admin.users.store({ id: user.id }).url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok && result.code == 200) {
                    toast.success(result.message);
                }else{
                    throw Error(result.message);
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
        <>
            <Form
                {...form}
            >
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6  max-w-full md:max-w-2/3 lg:max-w-1/2">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full flex gap-4">
                                    <FormLabel className="min-w-26 max-w-1/2 pt-2">ชื่อ-นามสกุล</FormLabel>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <FormControl>
                                            <Input placeholder="ชื่อ-นามสกุล" disabled={isFetch} {...field} />
                                        </FormControl>
                                        {!fieldState.error ? (
                                            <FormDescription>
                                                ชื่อที่แสดงผลในระบบ
                                            </FormDescription>
                                        ) : (
                                            <FormMessage />
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full flex gap-4">
                                    <FormLabel className="min-w-26 max-w-1/2 pt-2">username</FormLabel>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <FormControl>
                                            <Input placeholder="username" disabled={isFetch} {...field} />
                                        </FormControl>
                                        {!fieldState.error ? (
                                            <FormDescription>
                                                ชื่อที่ใช้ระบุในระบบ (ไม่ซ้ำกัน)
                                            </FormDescription>
                                        ) : (
                                            <FormMessage />
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full flex gap-4">
                                    <FormLabel className="min-w-26 max-w-1/2 pt-2">อีเมล</FormLabel>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <FormControl>
                                            <Input placeholder="email" disabled={isFetch} {...field} />
                                        </FormControl>
                                        {!fieldState.error ? (
                                            <FormDescription>
                                                อีเมลที่ใช้ในการติดต่อและเข้าสู่ระบบ
                                            </FormDescription>
                                        ) : (
                                            <FormMessage />
                                        )}
                                        <FormField
                                            control={form.control}
                                            name="email_verified"
                                            render={({ field, fieldState }) => (
                                                <FormItem className="w-full flex gap-4">
                                                    <FormControl>
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox id="change_password" defaultChecked={email_verified} disabled={email_verified == true ? email_verified : isFetch} onCheckedChange={field.onChange} />
                                                            <FormLabel htmlFor="change_password">ยืนยันแล้ว</FormLabel>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="custom_rate"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full flex gap-4">
                                    <FormLabel className="min-w-26 max-w-1/2 pt-2">เพิ่มค่าเรท</FormLabel>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <FormControl>
                                            <Input placeholder="เรท" disabled={isFetch} defaultValue={field.value} onChange={e => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <div className="flex gap-2">
                                            <FormDescription>
                                                {rank.level_json.rate}+{field.value} = {rank.level_json.rate + field.value}%
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isFetch}>
                            {isFetch && <Loader className="animate-spin" />}
                            บันทึก
                        </Button>

                        <FormField
                            control={form.control}
                            name="error_message"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full  flex gap-4">
                                    <FormLabel className="min-w-26 max-w-1/2 pt-2"></FormLabel>
                                    {!fieldState.error ? (
                                        <FormDescription className="opacity-0">ข้อความ errors</FormDescription>
                                    ) : (
                                        <FormMessage />
                                    )}
                                </FormItem>
                            )}
                        />

                    </div>
                </form>
            </Form>
        </>
    );
}
