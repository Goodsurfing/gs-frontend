import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { AdminUser } from "../../model/types/adminSchema";
import styles from "./UserInfoTable.module.scss";

const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;

interface UserInfoTableProps {
    userId: string;
    data: AdminUser;
}

export const UserInfoTable: FC<UserInfoTableProps> = (props) => {
    const { userId, data } = props;
    const {
        created, lastVisit, endPayment, isPayment, isActive,
        isVerified, isOrganization, isVolunteer,
    } = data;

    const rows = [
        { label: "ID", value: userId },
        { label: "Дата регистрации", value: created },
        { label: "Последний вход", value: lastVisit },
        { label: "Окончание членства", value: endPayment },
        { label: "Активное членство", value: isPayment ? YesText : NoText },
        { label: "Активный пользователь", value: isActive ? YesText : NoText },
        { label: "Подтверждён", value: isVerified ? YesText : NoText },
        { label: "Хост", value: isOrganization ? YesText : NoText },
        { label: "Волонтёр", value: isVolunteer ? YesText : NoText },
    ];

    return (
        <div className={styles.wrapper}>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell className={styles.labelCell}>
                                    <b>{row.label}</b>
                                </TableCell>
                                <TableCell className={styles.valueCell}>
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
