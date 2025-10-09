import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";


export function ExpertBadge({ level, type }: { level: number, type?: string }) {
    return (
        <div
            className={cn( "flex  items-center justify-center gap-1")}>
            <span className="text-xs text-primary font-bold">W{level}</span>
            <span className="text-xs text-primary font-bold">{type}</span>
        </div>
    );
}
