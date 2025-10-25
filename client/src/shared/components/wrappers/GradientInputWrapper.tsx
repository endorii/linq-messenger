export function GradientInputWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full relative rounded-xl group bg-transparent focus-within:bg-gradient-to-br focus-within:from-blue-600 focus-within:to-sky-600  dark:focus-within:from-violet-600 dark:focus-within:to-indigo-600 p-[2px] transition-all duration-300">
            {children}
        </div>
    );
}
