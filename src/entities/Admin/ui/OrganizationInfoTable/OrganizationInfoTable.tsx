import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import styles from "./OrganizationInfoTable.module.scss";
import { AdminOrganization } from "../../model/types/adminSchema";

const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;

interface OrganizationInfoTableProps {
    organizationId: string;
    data: AdminOrganization;
}

export const OrganizationInfoTable: FC<OrganizationInfoTableProps> = (props) => {
    const { organizationId, data } = props;
    const {
        countApplications, countVacancies, isActive,
    } = data;

    const rows = [
        { label: "ID", value: organizationId },
        // { label: "Владелец", value: organization.owner },
        { label: "Кол-во заявок", value: countApplications },
        { label: "Кол-во вакансий", value: countVacancies },
        // { label: "Кол-во волонтёров", value: organization.countVolunteers },
        { label: "Организация активна", value: isActive ? YesText : NoText },
    ];

    return (
        <div className={styles.wrapper}>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {rows.map((row: any) => (
                            <TableRow key={row.label}>
                                <TableCell className={styles.labelCell}>
                                    <b>{row.label}</b>
                                </TableCell>
                                <TableCell className={styles.valueCell}>{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
