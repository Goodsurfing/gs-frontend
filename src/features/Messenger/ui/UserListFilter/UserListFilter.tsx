import React, { useState, FC } from "react";
import styles from "./UserListFilter.module.scss";
import { OfferState } from "@/entities/Offer";

type UserListTypes = OfferState | null;

interface UserListFilterProps {
    onChange?: () => void;
}

export const UserListFilter: FC<UserListFilterProps> = (props) => {
    const { onChange } = props;
    const [filterValue, setFilterValue] = useState<UserListTypes>(null);
    return (
        <div className={styles.wrapepr}>UserListFilter</div>
    );
};
