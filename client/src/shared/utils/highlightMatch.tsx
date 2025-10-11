import { JSX } from "react";

export function highlightMatch(text: string, query: string): JSX.Element {
    if (!query.trim()) return <div>{text}</div>;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <div
                        key={i}
                        className="inline bg-violet-800/50 text-violet-400 font-semibold"
                    >
                        {part}
                    </div>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}
