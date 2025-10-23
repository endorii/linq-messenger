"use client";

import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { SharedPrivacyRadioLevels } from "../components/SharedPrivacyRadioLevels";

export function PrivacyBirthTab({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();
    const settingKey: keyof IPrivacySettings = "dateOfBirth";
    const privacySetting = privacySettings[settingKey];
    return (
        <>
            <SharedSidebarMenu
                title={"Date of Birth"}
                onClose={() => setPrivacyTab("overview")}
            />
            <SharedPrivacyRadioLevels
                settingKey={settingKey}
                privacySetting={privacySetting}
                subtitle="Who can see my date of birth?"
            />
        </>
    );
}
