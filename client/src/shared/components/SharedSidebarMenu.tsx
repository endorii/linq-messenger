import { BackIcon } from "../icons";
import { ButtonIcon } from "./ui/buttons";

export function SharedSidebarMenu({
    title,
    onClose,
}: {
    title: string;
    onClose: () => void;
}) {
    return (
        <div className="text-black dark:text-white flex gap-[25px] items-center py-[10px] px-[25px]">
            <div className="flex gap-[20px] items-center min-h-[50px]">
                <ButtonIcon onClick={onClose}>
                    <BackIcon className="w-[24px] stroke-neutral-900 dark:stroke-white stroke-[2.5] fill-none" />
                </ButtonIcon>
                <div className="text-xl font-semibold">{title}</div>
            </div>
        </div>
    );
}
