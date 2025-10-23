import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";
import { PrivacyTabType, PrivacyLevel } from "@/shared/types/types";
import { useNavigationStore } from "@/store";

interface PrivacyItem {
    type: Exclude<PrivacyTabType, "overview">;
    title: string;
}

const privacyItems: PrivacyItem[] = [
    { type: "phoneVisibility", title: "Who can see my phone number?" },
    { type: "lastSeen", title: "Who can see my last seen time?" },
    { type: "bio", title: "Bio" },
    { type: "dateOfBirth", title: "Date of Birth" },
    { type: "calls", title: "Who can call me?" },
    {
        type: "voiceMessagesAndVideo",
        title: "Who can send me voice or video messages?",
    },
    { type: "messages", title: "Who can send me messages?" },
    { type: "addMe", title: "Who can add me?" },
];

const formatPrivacyLevel = (level: PrivacyLevel): string => {
    const map: Record<PrivacyLevel, string> = {
        NOBODY: "Nobody",
        MY_CONTACTS: "My Contacts",
        EVERYBODY: "Everybody",
    };
    return map[level];
};

export function SidebarProfilePrivacy({
    privacySettings,
}: {
    privacySettings: IPrivacySettings;
}) {
    const { setPrivacyTab } = useNavigationStore();

    return (
        <div className="flex flex-col px-2 py-2">
            <div className="px-4 font-semibold text-neutral-400 mb-2">
                Privacy
            </div>
            <div className="flex flex-col gap-[2px] w-full">
                {privacyItems.map((item) => (
                    <button
                        key={item.type}
                        className="flex flex-col p-[15px] hover:bg-white/5 cursor-pointer rounded-xl"
                        onClick={() => setPrivacyTab(item.type)}
                    >
                        <div className="text-left">{item.title}</div>
                        <div className="text-sm text-neutral-400 text-left">
                            {privacySettings?.[item.type]
                                ? formatPrivacyLevel(privacySettings[item.type])
                                : "Loading..."}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
