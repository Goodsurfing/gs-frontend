import React, { FC } from "react";
import styles from "./ListFilter.module.scss";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { UserListFilter } from "@/features/Messenger";
import { FormApplicationStatus } from "@/entities/Application";

interface ListFilterProps {
    value: string;
    valueStatus: FormApplicationStatus | null;
    onChange: (value: string) => void;
    onChangeStatus: (valueStatus: FormApplicationStatus | null) => void;
}

export const ListFilter: FC<ListFilterProps> = (props) => {
    const {
        value, valueStatus, onChange, onChangeStatus,
    } = props;

    return (
        <div className={styles.wrapper}>
            <SearchInput value={value} onChange={onChange} />
            <UserListFilter filterValue={valueStatus} onChange={onChangeStatus} />
        </div>
    );
};
