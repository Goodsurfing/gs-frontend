import cn from "classnames";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/shared/ui/Button/Button";

import { goodsurfingNowData } from "../../model/data/aboutproject";
import { GoodsurfingNowItem } from "../GoodsurfingNowItem/GoodsurfingNowItem";
import styles from "./GoodsurfingNow.module.scss";

interface GoodsurfingNowProps {
    className?: string;
}

export const GoodsurfingNow: FC<GoodsurfingNowProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    const renderItems = useMemo(
        () => goodsurfingNowData.map((item, index) => (
            <GoodsurfingNowItem
                title={item.title}
                description={item.description}
                key={index}
            />
        )),
        [],
    );
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("ГудСёрфинг сегодня")}</h2>
            <div className={styles.content}>{renderItems}</div>
            <Button
                className={styles.button}
                color="BLUE"
                size="MEDIUM"
                variant="FILL"
            >
                {t("Присоединиться")}
            </Button>
        </section>
    );
};
