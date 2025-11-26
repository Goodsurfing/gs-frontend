import React from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { adminOrganizationsAdapter } from "../../lib/adminAdapters";
import { mockedHostData } from "@/entities/Host/model/data/mockedHostData";
import styles from "./OrganizationInfoTable.module.scss";

const organization = adminOrganizationsAdapter([mockedHostData])[0];
const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;
const rows = [
    { label: "ID", value: organization.id },
    { label: "Владелец", value: organization.owner },
    { label: "Кол-во участников", value: organization.countMembers },
    { label: "Кол-во вакансий", value: organization.countVacancies },
    { label: "Кол-во волонтёров", value: organization.countVolunteers },
    { label: "Организация заблокирована", value: organization.isBlock ? YesText : NoText },
];

export const OrganizationInfoTable = () => (
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
