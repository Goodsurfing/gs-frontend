import React, { FC, memo } from "react";
import { Link } from "react-router-dom";
import documentIcon from "@/shared/assets/icons/document-search.svg";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";
import styles from "./ReportItem.module.scss";

interface ReportItemProps {
    title: string;
    url: string;
}

export const ReportItem: FC<ReportItemProps> = memo((props: ReportItemProps) => {
    const { title, url } = props;
    return (
        <div className={styles.wrapper}>
            <Link to="https://translate.google.com/?hl=ru">{title}</Link>
            <IconComponent icon={documentIcon} className={styles.icon} />
        </div>
    );
});
