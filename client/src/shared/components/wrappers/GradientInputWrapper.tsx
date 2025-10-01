function GradientInputWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full relative rounded-xl group bg-transparent focus-within:bg-gradient-to-br focus-within:from-violet-600 focus-within:to-indigo-600 p-[2px] transition-all duration-300">
            {children}
        </div>
    );
}

export default GradientInputWrapper;
