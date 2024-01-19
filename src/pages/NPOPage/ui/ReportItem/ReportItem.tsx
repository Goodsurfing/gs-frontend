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
        <Link to={url} className={styles.link} target="_blank" rel="noopener noreferrer">
            <div className={styles.wrapper}>
                <span className={styles.title}>{title}</span>
                <IconComponent icon={documentIcon} className={styles.icon} />
            </div>
        </Link>
    );
});
