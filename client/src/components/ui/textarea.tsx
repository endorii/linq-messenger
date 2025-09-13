import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
    className,
    errorMessage,
    ...props
}: React.ComponentProps<"textarea"> & { errorMessage?: string }) {
    return (
        <div className="flex flex-col gap-[5px]">
            <textarea
                data-slot="textarea"
                className={cn(
                    `border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className} ${
                        errorMessage && "border-red-500"
                    }`
                )}
                {...props}
            />
            {errorMessage && (
                <div className="text-sm text-red-500">{errorMessage}</div>
            )}
        </div>
    );
}

export { Textarea };
