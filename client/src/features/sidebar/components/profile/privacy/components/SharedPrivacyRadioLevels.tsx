import { useUpdatePrivacy } from "@/features/sidebar/hooks/usePrivacy";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { PrivacyLevel } from "@/shared/types/types";
import { useState } from "react";

const values: PrivacyLevel[] = ["EVERYBODY", "MY_CONTACTS", "NOBODY"];

interface SharedPrivacyItemProps {
    settingKey: keyof IPrivacySettings;
    privacySetting: PrivacyLevel;
    subtitle: string;
}

export function SharedPrivacyRadioLevels({
    settingKey,
    privacySetting,
    subtitle,
}: SharedPrivacyItemProps) {
    const [selectedValue, setSelectedValue] =
        useState<PrivacyLevel>(privacySetting);
    const updatePrivacy = useUpdatePrivacy();

    const handleChange = (value: PrivacyLevel) => {
        setSelectedValue(value);
        updatePrivacy.mutateAsync({
            [settingKey]: value,
        });
    };

    return (
        <div className="flex flex-col px-2 py-2">
            <div className="px-4 font-semibold text-neutral-400 mb-2">
                {subtitle}
            </div>
            <RadioGroup
                value={selectedValue}
                onValueChange={handleChange}
                className="flex flex-col gap-[2px] w-full"
            >
                {values.map((value) => (
                    <div
                        key={value}
                        onClick={() => handleChange(value)}
                        className="flex items-center gap-[20px] p-[15px] hover:bg-white/5 cursor-pointer rounded-xl"
                    >
                        <RadioGroupItem value={value} id={value} />
                        <Label
                            htmlFor={value}
                            className="font-semibold text-base cursor-pointer"
                        >
                            {getLabel(value)}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}

function getLabel(value: PrivacyLevel): string {
    switch (value) {
        case "EVERYBODY":
            return "Everybody";
        case "MY_CONTACTS":
            return "My contacts";
        case "NOBODY":
            return "Nobody";
        default:
            return "";
    }
}
