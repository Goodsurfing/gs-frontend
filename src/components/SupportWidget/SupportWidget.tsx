import cn from "classnames";
import React, { FC } from "react";


import supportImage from "@/shared/assets/images/supportImage.jpg";

import Button from "@/shared/ui/Button/Button";
import { Theme } from "../SideMenu/types/SideMenu.interface";
import styles from "./SupportWidget.module.scss";

interface ISupportWidget {
    theme?: Theme;
}

const SupportWidget: FC<ISupportWidget> = ({ theme }) => (
    <aside
        className={cn(styles.support, {
            [styles.dark]: theme === "DARK",
            [styles.light]: theme === "LIGHT",
        })}
    >
        <img src={supportImage} alt="Кристина" />
        <h4 className={styles.name}>Кристина</h4>
        <p className={styles.description}>
            Ваш персональный помощник по работе с системой
        </p>
        <Button  ={.OUTLINED}>
            Написать
        </Button>
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

export default SupportWidget;
