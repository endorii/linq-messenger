import { ReactNode } from "react";

function authLayout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
}

export default authLayout;
