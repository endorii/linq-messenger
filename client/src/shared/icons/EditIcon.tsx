const EditIcon = ({ className }: { className: string }) => {
    return (
        <svg viewBox="0 0 24 24" className={className}>
            <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" />
            <polygon points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" />
        </svg>
    );
};

export default EditIcon;
