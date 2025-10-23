import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SidebarProfilePrivacy } from "../privacy/SidebarProfilePrivacy";
import { PrivacyPhoneNumberTab } from "../privacy/tabs/PrivacyPhoneNumberTab";
import { PrivacyLastSeenTab } from "../privacy/tabs/PrivacyLastSeenTab";
import { PrivacyBioTab } from "../privacy/tabs/PrivacyBioTab";
import { PrivacyBirthTab } from "../privacy/tabs/PrivacyBirthTab";
import { PrivacyCallMeTab } from "../privacy/tabs/PrivacyCallMeTab";
import { PrivacyVoiceAndVideoTab } from "../privacy/tabs/PrivacyVoiceAndVideoTab";
import { PrivacySendMessagesTab } from "../privacy/tabs/PrivacySendMessagesTab";
import { PrivacyAddMeTab } from "../privacy/tabs/PrivacyAddMeTab";
import { useUserPrivacy } from "@/features/sidebar/hooks/usePrivacy";

export function SidebarProfilePrivacyTab() {
    const { setProfileTab, privacyTab } = useNavigationStore();

    const { data: privacySettings } = useUserPrivacy();

    if (!privacySettings) return;
    return (
        <>
            {privacyTab === "overview" && (
                <>
                    <SharedSidebarMenu
                        title={"Privacy and Security"}
                        onClose={() => setProfileTab("overview")}
                    />
                    <SidebarProfilePrivacy privacySettings={privacySettings} />
                </>
            )}
            {privacyTab === "phoneVisibility" && (
                <PrivacyPhoneNumberTab privacySettings={privacySettings} />
            )}
            {privacyTab === "lastSeen" && (
                <PrivacyLastSeenTab privacySettings={privacySettings} />
            )}
            {privacyTab === "bio" && (
                <PrivacyBioTab privacySettings={privacySettings} />
            )}
            {privacyTab === "dateOfBirth" && (
                <PrivacyBirthTab privacySettings={privacySettings} />
            )}
            {privacyTab === "calls" && (
                <PrivacyCallMeTab privacySettings={privacySettings} />
            )}
            {privacyTab === "voiceMessagesAndVideo" && (
                <PrivacyVoiceAndVideoTab privacySettings={privacySettings} />
            )}
            {privacyTab === "messages" && (
                <PrivacySendMessagesTab privacySettings={privacySettings} />
            )}
            {privacyTab === "addMe" && (
                <PrivacyAddMeTab privacySettings={privacySettings} />
            )}
        </>
    );
}
