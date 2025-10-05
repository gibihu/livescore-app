import { cn } from "@/lib/utils";
import { CirclePoundSterling } from "lucide-react";



function AppCoins({className}:{className?: string}){
    return(
        <>
            <CirclePoundSterling className={cn('text-yellow-600 size-4', className)} />
        </>
    );
}

export {
    AppCoins
};
