import { BurgerMenuIcon, SearchIcon } from "@/shared/icons";
import { PhoneIcon } from "lucide-react";

function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full relative h-[100vh]">
            <div className="absolute top-0 w-full z-1 flex justify-between text-white bg-neutral-900 px-[20px] py-[10px] pr-[50px]">
                <div className="flex gap-[20px]">
                    <div className="w-[45px] h-[45px] rounded-full bg-neutral-600"></div>
                    <div>
                        <div className="font-semibold">
                            New channel with the very long name
                        </div>
                        <div className="text-sm text-neutral-400">
                            30 454 subscribers
                        </div>
                    </div>
                </div>
                <div className="flex gap-[25px]">
                    <button>
                        <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>
                    <button>
                        <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>

                    <button>
                        <BurgerMenuIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>
                </div>
            </div>
            <div className="h-full">{children}</div>
        </div>
    );
}

export default ChatLayout;
