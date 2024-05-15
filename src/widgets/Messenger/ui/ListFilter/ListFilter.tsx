import React, { FC } from "react";
import styles from "./ListFilter.module.scss";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

export const ListFilter: FC = () => (
    <div className={styles.wrapper}>
        <SearchInput />
    </div>
);
