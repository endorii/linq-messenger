function OwnerIcon({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path
                d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default OwnerIcon;
