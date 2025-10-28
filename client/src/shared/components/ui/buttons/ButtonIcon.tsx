export function ButtonIcon({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            className={`p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-full ${
                className ?? ""
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
