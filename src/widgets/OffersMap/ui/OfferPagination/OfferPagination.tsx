import React, { FC } from "react";
import cn from "classnames";
import { Pagination } from "@mui/material";
import styles from "./OfferPagination.module.scss";

interface OfferPaginationProps {
    className?: string
}

export const OfferPagination: FC<OfferPaginationProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <Pagination count={3} size="large" />
        </div>
    );
};
