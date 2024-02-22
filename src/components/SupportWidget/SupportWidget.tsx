import cn from "classnames";
import { memo } from "react";

import supportImage from "@/shared/assets/images/supportImage.jpg";

import Button from "@/shared/ui/Button/Button";

import styles from "./SupportWidget.module.scss";

const SupportWidget = memo(() => (
    <aside
        className={cn(styles.support)}
    >
        <img src={supportImage} alt="Кристина" />
        <h4 className={styles.name}>Кристина</h4>
        <p className={styles.description}>
            Ваш персональный помощник по работе с системой
        </p>
        <Button size="MEDIUM" color="BLUE" variant="OUTLINE">
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
));

export default SupportWidget;
