import React from "react";
import Button from "@/shared/ui/Button/Button";
import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";
import styles from "./AdminHeader.module.scss";

export const AdminHeader = () => {
    const onLogout = () => {};

    return (
        <EmptyHeader className={styles.header}>
            <div className={styles.button}>
                <Button onClick={onLogout} color="BLUE" size="SMALL" variant="FILL">Выйти</Button>
            </div>
        </EmptyHeader>
    );
};
