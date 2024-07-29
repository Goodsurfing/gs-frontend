import React, { FC } from "react";
import styles from "./ListFilter.module.scss";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { UserListFilter } from "@/features/Messenger";

export const ListFilter: FC = () => (
    <div className={styles.wrapper}>
        <SearchInput />
        <UserListFilter />
    </div>
);
