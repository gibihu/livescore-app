
import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { usePage } from "@/hooks/usePage";
import AuthLayout from "@/layout/auth-layouy";
import type { PackType } from "@/types/global";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DraggableList } from "../../../components/dashboard/admins/list-drag";
import AdminLayout from "@/layout/admin-layout";

const API_URL: string = import.meta.env.VITE_API_URL;
export default function PackagesDashboard() {
    
    const [items, setItems] = useState<PackType[]>([]);
    const [isFetch, setIsFetch] = useState<boolean>(true);

    
    useEffect(()=>{
        const fetchData = async () => {
            setIsFetch(true);
            const res = await fetch(`${API_URL}/package-points`, { credentials: "include" });
            const result = await res.json();
            if(result.code == 200){
                const data = result.data;
                setItems(data);
            }else{
                const errors = result;
                toast.error(result.message, { description: errors.detail || '' });
            }
            setIsFetch(false);
        };

        fetchData();
    }, []);
    
    return (
        <AdminLayout>
            <Head title="packages" />
            <AppSidebar title="packages">
                <DraggableList items={items} />
            </AppSidebar>
        </AdminLayout>
    )
}
