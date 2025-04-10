import React, { FC, PropsWithChildren } from "react";
import cn from "classnames";
import SectionTitle from "@/shared/ui/SectionTitle/SectionTitle";

import styles from "./Section.module.scss";

interface SectionProps {
    title?: string;
    className?: string;
    classNameWrapper?: string;
    classNameContent?: string;
}

const Section: FC<PropsWithChildren<SectionProps>> = ({
    title, children, className, classNameWrapper, classNameContent,
}) => (
    <section className={cn(styles.section, classNameWrapper)}>
        <div className={cn(styles.container, className)}>
            {title && <SectionTitle>{title}</SectionTitle>}
            <div className={cn(styles.content, classNameContent)}>{children}</div>
        </div>
    </section>
);

export default Section;
