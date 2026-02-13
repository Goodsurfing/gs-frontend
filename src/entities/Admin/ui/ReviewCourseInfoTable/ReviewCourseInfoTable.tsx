import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { useGetFullName } from "@/shared/lib/getFullName";
import { GetAdminReviewsLesson } from "../../model/types/adminCourseSchema";
import styles from "./ReviewCourseInfoTable.module.scss";

interface ReviewCourseInfoTableProps {
    data: GetAdminReviewsLesson;
}

export const ReviewCourseInfoTable: FC<ReviewCourseInfoTableProps> = (props) => {
    const { data } = props;
    const { getFullName } = useGetFullName();
    const {
        id, author, created,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Имя автора", value: getFullName(author.firstName, author.lastName) },
        // { label: "Название курса", value: name },
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
