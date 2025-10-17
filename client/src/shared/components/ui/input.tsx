import * as React from "react";

import { cn } from "@/lib/utils";
import { GradientInputWrapper } from "../wrappers/GradientInputWrapper";

function Input({
    className,
    type,
    errorMessage,
    ...props
}: React.ComponentProps<"input"> & { errorMessage?: string }) {
    return (
        <div className="flex flex-col gap-[3px] w-full">
            <GradientInputWrapper>
                <input
                    type={type}
                    data-slot="input"
                    className={cn(
                        `file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 border border-white/5 focus:border-transparent flex h-9 w-full min-w-0 rounded-xl bg-neutral-900 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className} ${
                            errorMessage && "border-red-500"
                        }`
                    )}
                    {...props}
                />
            </GradientInputWrapper>
            {errorMessage && (
                <div className=" pl-[5px] text-sm text-red-500">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export { Input };
