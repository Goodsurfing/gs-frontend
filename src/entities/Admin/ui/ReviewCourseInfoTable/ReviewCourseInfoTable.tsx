import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewCourseInfoTable.module.scss";
import { GetAdminReviewCourse } from "../../model/types/adminCourseSchema";

interface ReviewCourseInfoTableProps {
    data: GetAdminReviewCourse;
}

export const ReviewCourseInfoTable: FC<ReviewCourseInfoTableProps> = (props) => {
    const { data } = props;
    const { getFullName } = useGetFullName();
    const {
        id, authorFirstName, authorLastName,
        name, date,
    } = data;

    const rows = [
        { label: "ID", value: id },
        { label: "Имя автора", value: getFullName(authorFirstName, authorLastName) },
        { label: "Название курса", value: name },
        { label: "Дата создания", value: date },
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
