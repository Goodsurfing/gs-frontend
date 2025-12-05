import React, { useState } from "react";
import styles from "./AdminConditionsOffer.module.scss";
import Button from "@/shared/ui/Button/Button";
import { AdminHousesTable } from "../AdminHousesTable/AdminHousesTable";
import { AdminFoodsTable } from "../AdminFoodsTable/AdminFoodsTable";
import { AdminTransfersTable } from "../AdminTransfersTable/AdminTransfersTable";

export const AdminConditionsOffer = () => {
    const [isHousesTableOpen, setHousesTableOpen] = useState(false);
    const [isFoodsTableOpen, setFoodsTableOpen] = useState(false);
    const [isTransfersTableOpen, setTransfersTableOpen] = useState(false);

    const housesTextButton = isHousesTableOpen ? "Закрыть таблицу жилья" : "Открыть таблицу жилья";
    const foodsTextButton = isFoodsTableOpen ? "Закрыть таблицу питания" : "Открыть таблицу питания";
    const transfersTextButton = isTransfersTableOpen ? "Закрыть таблицу оплачиваемого проезда" : "Открыть таблицу оплачиваемого проезда";

    const handleHousesTableOpen = () => {
        setHousesTableOpen((prev) => !prev);
    };

    const handleFoodsTableOpen = () => {
        setFoodsTableOpen((prev) => !prev);
    };

    const handleTransfersTableOpen = () => {
        setTransfersTableOpen((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <Button onClick={handleHousesTableOpen} color="BLUE" size="SMALL" variant="FILL">{housesTextButton}</Button>
                <Button onClick={handleFoodsTableOpen} color="GREEN" size="SMALL" variant="FILL">{foodsTextButton}</Button>
                <Button onClick={handleTransfersTableOpen} color="GRAY" size="SMALL" variant="FILL">{transfersTextButton}</Button>
            </div>
            {isHousesTableOpen && <AdminHousesTable />}
            {isFoodsTableOpen && <AdminFoodsTable />}
            {isTransfersTableOpen && <AdminTransfersTable />}
        </div>
    );
};
