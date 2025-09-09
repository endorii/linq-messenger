const InfoIcon = ({ className }: { className: string }) => {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 17V11" />
            <circle cx="1" cy="1" r="0.5" transform="matrix(1 0 0 -1 11 9)" />
        </svg>
    );
};

export default InfoIcon;
