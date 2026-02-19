import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { useGetFullName } from "@/shared/lib/getFullName";
import { GetAdminReviewNews } from "../../model/types/adminNewsSchema";
import styles from "./ReviewNewsInfoTable.module.scss";

interface ReviewNewsInfoTableProps {
    data: GetAdminReviewNews;
}

const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;

export const ReviewNewsInfoTable: FC<ReviewNewsInfoTableProps> = (props) => {
    const { data } = props;
    const { getFullName } = useGetFullName();
    const {
        id, author, created, isActive,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Имя автора", value: getFullName(author.firstName, author.lastName) },
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
