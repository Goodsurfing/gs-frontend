import React from "react";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

interface VideoSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const VideoSearch = (props: VideoSearchProps) => {
    const { value, onChange } = props;
    return (
        <SearchInput sx={{ maxWidth: "370px" }} value={value} onChange={onChange} />
    );
};
