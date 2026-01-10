import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewVacancyInfoTable.module.scss";

export interface ReviewVacancy {
    id: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    vacancyName: string | null;
    created: string;
}

interface ReviewVacancyInfoTableProps {
    data: ReviewVacancy;
}

export const ReviewVacancyInfoTable: FC<ReviewVacancyInfoTableProps> = (props) => {
    const { data } = props;
    const { getFullName } = useGetFullName();
    const {
        created, authorFirstName, authorLastName,
        id, vacancyName,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Имя автора", value: getFullName(authorFirstName, authorLastName) },
        { label: "Название вакансии", value: vacancyName },
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
