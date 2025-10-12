import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";
import SidebarSearch from "../search/SidebarSearch";
import SidebarSearchMenu from "../search/SidebarSearchMenu";

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
