import { Skeleton } from '@/components/ui/skeleton'; // ปรับ path ตามโปรเจคคุณ
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface ImageWithSkeletonProps {
    src: string;
    alt?: string;
    title?: string;
    divClass?: string;
    className?: string;
    skelClass?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ src, alt = 'image', title, className, divClass, skelClass }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={cn('h-full w-full', divClass)}>
            {isLoading && !hasError && <Skeleton className={cn('h-full w-full rounded-xl bg-gray-500/30', skelClass)} title={title} />}
            {!hasError && (
                <img
                    src={src}
                    alt={alt}
                    title={title}
                    className={cn(
                        'h-full max-h-[30vh] w-full rounded-xl border object-cover shadow-lg dark:border-gray-700',
                        className,
                        isLoading ? 'hidden' : 'block',
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}
            {hasError && <div className="flex h-full w-full items-center justify-center text-gray-500">ไม่สามารถโหลดรูปได้</div>}
        </div>
    );
};

export default ImageWithSkeleton;
