'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

type Type = {
    className?: string;
    onChange?: (file: File | null) => void;
    optional?: boolean;
    urlPreview?: string;
};

export function ImageDropInput({ className, onChange, optional, urlPreview, ...props }: Type) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                onChange?.(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleClear = () => {
        setPreview(null);
        onChange?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
                'relative flex h-full min-h-20 w-full items-center justify-center rounded-2xl border-2 border-dashed border-sidebar-accent text-sidebar-ring transition hover:bg-muted/30',
                preview && 'overflow-hidden p-0',
                className,
            )}
            onClick={() => inputRef.current?.click()}
        >
            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" {...props} />

            {!preview && (
                <div className="pointer-events-none flex flex-col items-center gap-2">
                    {urlPreview && (<img src={urlPreview} alt="Preview" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />)}
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-center text-sm">ลากแลวาง หรือคลิกเพื่ออัพโหลดรูป {optional ? ("(ไม่จำเป็น)") : '(จำเป็น)'}</span>
                </div>
            )}

            {preview && (
                <>
                    <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                        }}
                    >
                        <X className="size-4" />
                    </Button>
                </>
            )}
        </div>
    );
}
