import Button from "@/UI/Button/Button";
import cn from "classnames";
import React, { FC } from "react";

import supportImage from "@/assets/images/supportImage.jpg";

import { Variant } from "../../UI/Button/Button.interface";
import { Theme } from "../SideMenu/types/SideMenu.interface";
import styles from "./SupportWidget.module.scss";

interface ISupportWidget {
    theme?: Theme;
}

const SupportWidget: FC<ISupportWidget> = ({ theme }) => {
    return (
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
            <Button rounded variant={Variant.OUTLINED}>
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
};

export default SupportWidget;
