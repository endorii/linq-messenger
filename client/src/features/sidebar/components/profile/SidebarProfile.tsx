import { useProfile } from "@/features/auth/hooks/useAuth";
import {
    AtSignIcon,
    GlobeIcon,
    LockIcon,
    MailIcon,
    NotifcationIcon,
    PhoneIcon,
} from "@/shared/icons";
import Image from "next/image";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarProfile() {
    const { data: me, isPending: isMeLoading } = useProfile();
    const { setProfileTab } = useSidebarStore();

    if (isMeLoading) {
        return (
            <div className="flex justify-center items-center py-4">
                <div className="w-[150px] h-[150px] bg-gray-200 animate-pulse rounded-full" />
            </div>
        );
    }

    if (!me) return null;

    const infoButtons = [
        {
            icon: AtSignIcon,
            label: "username",
            value: `@${me.username}`,
        },
        {
            icon: MailIcon,
            label: "email",
            value: me.email,
        },
        {
            icon: PhoneIcon,
            label: "phone number",
            value: me.phone,
        },
    ];

    const settingsButtons = [
        {
            icon: NotifcationIcon,
            label: "Notifications",
            onClick: () => setProfileTab("notifications"),
        },
        {
            icon: LockIcon,
            label: "Privacy and Security",
            onClick: () => setProfileTab("privacy"),
        },
        {
            icon: GlobeIcon,
            label: "Language",
            onClick: () => setProfileTab("language"),
        },
    ];

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-y-auto gap-[20px]">
            <div className="flex flex-col gap-[15px] items-center">
                <Image
                    src={me.avatarUrl ?? ""}
                    alt="profileAvatar"
                    width={150}
                    height={150}
                    unoptimized
                    className="w-[150px] h-[150px] rounded-full object-cover"
                />
                <div className="text-center">
                    <div className="text-lg font-semibold">
                        {`${me.firstName} ${me.lastName}`}
                    </div>
                    <div className="text-neutral-400">
                        {me.isOnline ? "Online" : "last seen recently"}
                    </div>
                </div>
            </div>

            <div className="text-sm flex flex-col gap-[3px]">
                {infoButtons.map(({ icon: Icon, label, value }) => (
                    <button
                        key={label}
                        className="p-[10px] flex gap-[20px] hover:bg-white/5 rounded-xl text-left"
                    >
                        <Icon className="w-[30px] fill-none stroke-2 stroke-neutral-400" />
                        <div className="flex flex-col">
                            <div className="font-semibold text-base">
                                {value}
                            </div>
                            <div className="text-neutral-400">{label}</div>
                        </div>
                    </button>
                ))}
            </div>
            <hr className="w-full border-t border-neutral-800" />
            <div className="flex flex-col">
                {settingsButtons.map(({ icon: Icon, label, onClick }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className="p-[15px] flex items-center gap-[20px] hover:bg-white/5 rounded-xl w-full"
                    >
                        <Icon className="w-[30px] fill-none stroke-2 stroke-neutral-400" />
                        <div className="font-semibold">{label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SidebarProfile;
