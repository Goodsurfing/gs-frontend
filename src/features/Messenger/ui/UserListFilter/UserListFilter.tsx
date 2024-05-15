import React, { useState, FC } from "react";
import styles from "./UserListFilter.module.scss";
import { OfferState } from "@/entities/Offer";

interface UserListFilterProps {
    onChange?: () => void;
}

export const UserListFilter: FC<UserListFilterProps> = (props) => {
    const { onChange } = props;
    const [filterValue, setFilterValue] = useState<OfferState>(null);
    return (
        <div className={styles.wrapepr}>UserListFilter</div>
    );
};
