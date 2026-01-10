import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewVolunteerInfoTable.module.scss";

export interface ReviewVolunteer {
    id: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    volunteerFirstName: string | null;
    volunteerLastName: string | null;
    created: string;
}

interface ReviewVolunteerInfoTableProps {
    data: ReviewVolunteer;
}

export const ReviewVolunteerInfoTable: FC<ReviewVolunteerInfoTableProps> = (props) => {
    const { data } = props;
    const { getFullName } = useGetFullName();
    const {
        created, authorFirstName, authorLastName,
        id, volunteerFirstName, volunteerLastName,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Имя автора", value: getFullName(authorFirstName, authorLastName) },
        { label: "Имя волонтёра", value: getFullName(volunteerFirstName, volunteerLastName) },
        { label: "Дата создания", value: created },
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
