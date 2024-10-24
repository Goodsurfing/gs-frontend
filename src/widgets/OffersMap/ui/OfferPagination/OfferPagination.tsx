import React, { FC } from "react";
import cn from "classnames";
import { Pagination } from "@mui/material";
import styles from "./OfferPagination.module.scss";

interface OfferPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const OfferPagination: FC<OfferPaginationProps> = (props) => {
    const {
        className, currentPage, onPageChange, totalPages,
    } = props;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="large"
            />
        </div>
    );
};
