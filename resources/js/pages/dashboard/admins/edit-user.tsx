
import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import AdminLayout from "@/layout/admin-layout";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const API_URL: string = import.meta.env.VITE_API_URL;
export default function EditUser() {
    const { id } = useParams();
    const [user, setUser] = useState<User>();
    const [isLoading, setIsloading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchData = async () => {
            setIsloading(true);
            const res = await fetch(`${API_URL}/user/${id}`, { credentials: "include" });
            
            const result = await res.json();
            if(result.code == 200){
                const data = result.data;
                setUser(data);
                setIsloading(false);
                console.log(data);
            }else{
                const errors = result.errors;
                toast.error(result.message, {description: errors.detail || ''});
            }
        }

        fetchData();
    }, []);
    
    return (
        <AdminLayout>
            <Head title="Edit" />
            <AppSidebar title="User">
                {!isLoading && user?.name}
            </AppSidebar>
        </AdminLayout>
    )
}
