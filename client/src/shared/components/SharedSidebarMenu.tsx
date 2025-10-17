import { BackIcon } from "../icons";

export function SharedSidebarMenu({
    title,
    onClose,
}: {
    title: string;
    onClose: () => void;
}) {
    return (
        <div className="text-white flex gap-[25px] items-center py-[10px] px-[25px]">
            <div className="flex gap-[20px] items-center min-h-[50px]">
                <button onClick={onClose}>
                    <BackIcon className="w-[24px] stroke-white stroke-3" />
                </button>
                <div className="text-xl font-semibold">{title}</div>
            </div>
        </div>
    );
}
