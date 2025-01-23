import React, { FC } from "react";
import styles from "./ListFilter.module.scss";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { UserListFilter } from "@/features/Messenger";

interface ListFilterProps {
    value: string;
    onChange: (value: string) => void
}

export const ListFilter: FC<ListFilterProps> = (props) => {
    const { value, onChange } = props;

    return (
        <div className={styles.wrapper}>
            <SearchInput value={value} onChange={onChange} />
            <UserListFilter />
        </div>
    );
};
