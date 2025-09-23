import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    className?: string
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <Toaster position="top-center" />
                <div className="w-sm sm:w-lg md:w-2xl lg:w-4xl py-4">
                    {children}
                </div>
            </div>
        </>
    );
}
