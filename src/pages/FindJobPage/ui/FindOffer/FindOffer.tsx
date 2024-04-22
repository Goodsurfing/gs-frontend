import React, { FC } from "react";
import cn from "classnames";
import styles from "./FindOffer.module.scss";
import Button from "@/shared/ui/Button/Button";

interface FindOfferProps {
    className?: string;
}

export const FindOffer: FC<FindOfferProps> = (props) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    Найти сотрудников
                </h2>
                <p className={styles.description}>
                    Получайте помощь в своём деле и знакомьтесь с людьми со всего мира.
                </p>
                <Button color="GREEN" size="MEDIUM" variant="FILL" className={styles.button}>
                    Разместить вакансию
                </Button>
            </div>
            <div className={styles.image} />
        </section>
    );
};
