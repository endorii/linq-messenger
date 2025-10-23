"use client";

import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { SharedPrivacyRadioLevels } from "../components/SharedPrivacyRadioLevels";

export function PrivacyAddMeTab({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();
    const settingKey: keyof IPrivacySettings = "addMe";
    const privacySetting = privacySettings[settingKey];
    return (
        <>
            <SharedSidebarMenu
                title={"Add Me"}
                onClose={() => setPrivacyTab("overview")}
            />
            <SharedPrivacyRadioLevels
                settingKey={settingKey}
                privacySetting={privacySetting}
                subtitle="Who can add me?"
            />
        </>
    );
}
