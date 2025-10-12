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
                <div className="w-sm sm:w-xl md:w-3xl lg:w-5xl md:px-4 py-4">
                    {children}
                </div>
            </div>
        </>
    );
}
