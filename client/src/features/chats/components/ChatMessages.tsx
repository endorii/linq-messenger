"use client";

function ChatMessages({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="h-full pt-[65px] w-full 
                    // {/* custom bg-url */}
                bg-[url('https://i.pinimg.com/736x/a4/a4/61/a4a461c572891b4bf1f2e6af3d127428.jpg')]"
        >
            {children}
        </div>
    );
}

export default ChatMessages;
