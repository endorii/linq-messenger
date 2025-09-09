function BurgerMenuIcon({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path
                d="M4 6H20M4 12H20M4 18H20"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default BurgerMenuIcon;
