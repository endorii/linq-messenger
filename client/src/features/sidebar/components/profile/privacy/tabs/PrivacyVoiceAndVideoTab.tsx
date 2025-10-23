"use client";

import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { SharedPrivacyRadioLevels } from "../components/SharedPrivacyRadioLevels";

export function PrivacyVoiceAndVideoTab({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();

    const settingKey: keyof IPrivacySettings = "voiceMessagesAndVideo";
    const privacySetting = privacySettings[settingKey];

    return (
        <>
            <SharedSidebarMenu
                title={"Voice and Video Content"}
                onClose={() => setPrivacyTab("overview")}
            />
            <SharedPrivacyRadioLevels
                settingKey={settingKey}
                privacySetting={privacySetting}
                subtitle="Who can send me voice and video content?"
            />
        </>
    );
}
