import React from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { adminUsersAdapter } from "../../lib/adminAdapters";
import { mockedProfileData } from "@/entities/Profile/model/data/mockedProfileData";
import styles from "./UserInfoTable.module.scss";

const user = adminUsersAdapter(mockedProfileData)[0];
const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;
const rows = [
    { label: "ID", value: user.id },
    { label: "Дата регистрации", value: user.dateRegistration },
    { label: "Последний вход", value: user.dateLogin },
    { label: "Окончание членства", value: user.dateEndMembership },
    { label: "Активное членство", value: user.isMembership ? YesText : NoText },
    { label: "Блокировка", value: user.isBlock ? YesText : NoText },
    { label: "Подтверждён", value: user.isConfirmed ? YesText : NoText },
    { label: "Хост", value: user.isHost ? YesText : NoText },
    { label: "Волонтёр", value: user.isVolunteer ? YesText : NoText },
];

export const UserInfoTable = () => (
    <div className={styles.wrapper}>
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.label}>
                            <TableCell className={styles.labelCell}><b>{row.label}</b></TableCell>
                            <TableCell className={styles.valueCell}>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);
