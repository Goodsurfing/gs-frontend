import React, { FC } from "react";
import { CircularProgress } from "@mui/material";
import cn from "classnames";
import styles from "./MiniLoader.module.scss";

interface MiniLoaderProps {
    className?: string;
}

export const MiniLoader: FC<MiniLoaderProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <CircularProgress style={{ color: "var(--accent-color)" }} />
        </div>
    );
};
