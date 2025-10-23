"use client";

import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { SharedPrivacyRadioLevels } from "../components/SharedPrivacyRadioLevels";

export function PrivacyBioTab({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();
    const settingKey: keyof IPrivacySettings = "bio";
    const privacySetting = privacySettings[settingKey];
    return (
        <>
            <SharedSidebarMenu
                title={"Bio"}
                onClose={() => setPrivacyTab("overview")}
            />
            <SharedPrivacyRadioLevels
                settingKey={settingKey}
                privacySetting={privacySetting}
                subtitle="Who can see my bio?"
            />
        </>
    );
}
