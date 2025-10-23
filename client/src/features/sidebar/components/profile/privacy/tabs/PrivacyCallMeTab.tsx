"use client";

import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SharedPrivacyRadioLevels } from "../components/SharedPrivacyRadioLevels";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";

export function PrivacyCallMeTab({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();
    const settingKey: keyof IPrivacySettings = "calls";
    const privacySetting = privacySettings[settingKey];
    return (
        <>
            <SharedSidebarMenu
                title={"Call Me"}
                onClose={() => setPrivacyTab("overview")}
            />
            <SharedPrivacyRadioLevels
                settingKey={settingKey}
                privacySetting={privacySetting}
                subtitle="Who can call me?"
            />
        </>
    );
}
