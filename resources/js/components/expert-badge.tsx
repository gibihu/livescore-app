import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { UserGuast, UserType } from "@/types/user";


export function ExpertBadge({ item }: { item: UserGuast }) {
    const rank = item.rank;
    return (
        <div
            className={cn( "flex  items-center justify-center gap-1")}>
            {rank.level_text && (<span className="text-xs text-primary font-bold capitalize">{rank.level_text}</span>)}
            {rank.type_text && rank.type_text !== "unknown" && (<span className="text-xs text-primary font-bold">{rank.type_text}</span>)}
        </div>
    );
}
