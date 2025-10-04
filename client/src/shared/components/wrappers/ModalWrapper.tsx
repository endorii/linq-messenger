interface IModalWrapperProps {
    onClose: () => void;
    children: React.ReactNode;
    modalTitle?: string;
}

function ModalWrapper({ onClose, children, modalTitle }: IModalWrapperProps) {
    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center products-center justify-center z-50 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col gap-[15px] bg-neutral-900 rounded-xl text-white border border-white/5 p-[30px] max-w-[90vw] h-auto max-h-[80vh] shadow-lg overflow-y-auto cursor-default"
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

export default ModalWrapper;
