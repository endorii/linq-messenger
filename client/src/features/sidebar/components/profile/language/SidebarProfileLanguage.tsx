import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useState } from "react";

const languages = [
    { value: "en", label: "English", description: "English" },
    { value: "uk", label: "Українська", description: "Ukrainian" },
];

function SidebarProfileLanguage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    return (
        <div className="flex flex-col gap-[5px] px-[10px] py-[5px]">
            <div className="px-[15px] font-semibold text-neutral-400">
                Interface Language
            </div>
            <RadioGroup
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                className="flex flex-col gap-2 w-full"
            >
                {languages.map(({ value, label, description }) => (
                    <div
                        key={value}
                        onClick={() => setSelectedLanguage(value)}
                        className="flex items-center gap-[20px] p-[15px] hover:bg-white/5 cursor-pointer rounded-xl"
                    >
                        <RadioGroupItem value={value} id={value} />
                        <div className="flex flex-col">
                            <Label
                                htmlFor={value}
                                className="font-semibold text-base cursor-pointer"
                            >
                                {label}
                            </Label>
                            <div className="text-xs text-neutral-400 text-left">
                                {description}
                            </div>
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}

export default SidebarProfileLanguage;
