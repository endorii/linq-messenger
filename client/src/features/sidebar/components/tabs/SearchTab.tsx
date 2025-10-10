import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";
import SidebarSearch from "../SidebarSearch";
import SidebarSearchMenu from "../SidebarSearchMenu";

export function SearchTab() {
    const [searchValue, setSearchValue] = useState("");
    const debouncedValue = useDebounce(searchValue, 300);

    return (
        <>
            <SidebarSearchMenu
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <SidebarSearch searchValue={debouncedValue} />
        </>
    );
}
