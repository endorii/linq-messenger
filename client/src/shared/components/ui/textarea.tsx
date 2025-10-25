import * as React from "react";

import { cn } from "@/lib/utils";
import { GradientInputWrapper } from "../wrappers/GradientInputWrapper";

function Textarea({
    className,
    errorMessage,
    ...props
}: React.ComponentProps<"textarea"> & { errorMessage?: string }) {
    return (
        <>
            <GradientInputWrapper>
                <textarea
                    data-slot="textarea"
                    className={cn(
                        `bg-neutral-100 dark:bg-neutral-900 border placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-xl border-white/5 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none ${className} ${
                            errorMessage && "border-red-500"
                        }`
                    )}
                    {...props}
                />
            </GradientInputWrapper>
            {errorMessage && (
                <div className="text-sm text-red-500">{errorMessage}</div>
            )}
        </>
    );
}

export { Textarea };
