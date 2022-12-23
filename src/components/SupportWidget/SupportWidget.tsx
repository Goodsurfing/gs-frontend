import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";

import supportImage from "@/assets/images/supportImage.jpg";

import styles from "./SupportWidget.module.scss";

const SupportWidget: FC = () => {
    return (
        <aside className={styles.support}>
            <img src={supportImage} alt="Кристина" />
            <h4 className={styles.name}>Кристина</h4>
            <p className={styles.description}>
                Ваш персональный помощник по работе с системой
            </p>
            <Button variant="outlined">Написать</Button>
            <div className={styles.email}>
                <p>E-mail</p>
                <a
                    href="mailto:support@goodsurfing.org"
                    className={styles.address}
                >
                    support@goodsurfing.org
                </a>
            </div>
        </aside>
    );
};

export default SupportWidget;
