"use client";

import { Button } from "@/components/ui/button";
import LinqIcon from "./icons/LinqIcon";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center bg-neutral-200 h-screen">
            <div className="text-3xl font-semibold">
                {" "}
                &quot;Linq&quot; creation in progress...
            </div>
            <LinqIcon />
            <Button
                onClick={() => {
                    console.log("Dev mode...");
                }}
            >
                Click
            </Button>
        </div>
    );
}
