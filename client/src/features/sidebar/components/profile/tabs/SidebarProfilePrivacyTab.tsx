import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SidebarProfilePrivacy } from "../privacy/SidebarProfilePrivacy";
import { PrivacyPhoneNumberTab } from "../privacy/tabs/PrivacyPhoneNumberTab";
import { PrivacyLastSeenTab } from "../privacy/tabs/PrivacyLastSeenTab";
import { PrivacyBioTab } from "../privacy/tabs/PrivacyBioTab";
import { PrivacyVoiceAndVideoTab } from "../privacy/tabs/PrivacyVoiceAndVideoTab";
import { PrivacySendMessagesTab } from "../privacy/tabs/PrivacySendMessagesTab";
import { PrivacyAddMeTab } from "../privacy/tabs/PrivacyAddMeTab";
import { useUserPrivacy } from "@/features/sidebar/hooks/usePrivacy";
import { PrivacyUsernameTab } from "../privacy/tabs/PrivacyUsernameTab";

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
            {privacyTab === "lastSeenVisibility" && (
                <PrivacyLastSeenTab privacySettings={privacySettings} />
            )}
            {privacyTab === "bioVisibility" && (
                <PrivacyBioTab privacySettings={privacySettings} />
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
            {privacyTab === "usernameVisibility" && (
                <PrivacyUsernameTab privacySettings={privacySettings} />
            )}
        </>
    );
}
