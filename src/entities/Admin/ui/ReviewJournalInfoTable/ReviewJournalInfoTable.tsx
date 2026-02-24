import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { GetAdminReviewJournal } from "../../model/types/adminJournalSchema";
import styles from "./ReviewJournalInfoTable.module.scss";

interface ReviewJournalInfoTableProps {
    data: GetAdminReviewJournal;
}

const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;

export const ReviewJournalInfoTable: FC<ReviewJournalInfoTableProps> = (props) => {
    const { data } = props;
    const {
        id, created, isActive,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Отзыв опубликован", value: isActive ? YesText : NoText },
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
