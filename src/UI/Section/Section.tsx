import SectionTitle from "@/UI/SectionTitle/SectionTitle";
import React, { FC, PropsWithChildren } from "react";

import styles from "./Section.module.scss";

interface SectionProps {
    title?: string;
}

const Section: FC<PropsWithChildren<SectionProps>> = ({ title, children }) => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {title && <SectionTitle>{title}</SectionTitle>}
                <div className={styles.content}>{children}</div>
            </div>
        </section>
    );
};

export default Section;
