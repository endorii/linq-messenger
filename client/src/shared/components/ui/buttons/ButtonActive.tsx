export function ButtonActive({
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
            className={`absolute ${
                className ?? ""
            } max-h-[46px] max-w-[46px] p-2 rounded-xl bg-theme-gradient cursor-pointer transition-transform`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
