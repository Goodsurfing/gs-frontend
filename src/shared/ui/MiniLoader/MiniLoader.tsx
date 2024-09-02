import React from "react";
import { CircularProgress } from "@mui/material";
import styles from "./MiniLoader.module.scss";

export const MiniLoader = () => (
    <div className={styles.wrapper}>
        <CircularProgress style={{ color: "var(--accent-color)" }} />
    </div>
);
