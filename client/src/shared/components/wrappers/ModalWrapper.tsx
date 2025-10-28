interface IModalWrapperProps {
    onClose: () => void;
    children: React.ReactNode;
    modalTitle?: string;
}

export function ModalWrapper({
    onClose,
    children,
    modalTitle,
}: IModalWrapperProps) {
    return (
        <div
            className="modal-wrapper fixed inset-0 bg-black/80 flex items-center products-center justify-center z-50 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col gap-[15px] text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-white/5 p-[30px] min-w-auto md:min-w-[400px] max-w-[90vw] h-auto max-h-[80vh] shadow-lg overflow-y-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {modalTitle && (
                    <h4 className="text-xl font-semibold">{modalTitle}</h4>
                )}

                {children}
            </div>
        </div>
    );
}
