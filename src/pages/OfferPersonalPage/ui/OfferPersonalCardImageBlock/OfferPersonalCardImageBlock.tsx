import { memo } from "react";

import cn from "classnames";

import { useTranslation } from "react-i18next";
import firstImg from "@/shared/assets/icons/hostPersonal/first-img.svg";
import secondImg from "@/shared/assets/icons/hostPersonal/second-img.svg";
import thirdImg from "@/shared/assets/icons/hostPersonal/third-img.svg";
import fourthImg from "@/shared/assets/icons/hostPersonal/fourth-img.svg";
import dots from "@/shared/assets/icons/hostPersonal/dots.svg";

import styles from "./OfferPersonalCardImageBlock.module.scss";

interface OfferPersonalCardImageBlockProps {
    className?: string;
    onImagesClick: () => void;
}

export const OfferPersonalCardImageBlock = memo((props: OfferPersonalCardImageBlockProps) => {
    const { className, onImagesClick } = props;
    const { t } = useTranslation("offer");
    return (
        <div onClick={onImagesClick} className={cn(className, styles.wrapper)}>
            <div className={styles.overlay}>
                <img className={styles.dots} src={dots} alt="show more" />
                <span className={styles.dotsText}>{t("personalOffer.Фотографии")}</span>
            </div>
            <img className={styles.imageItem} src={firstImg} alt="first" />
            <img className={styles.imageItem} src={secondImg} alt="second" />
            <img className={styles.imageItem} src={thirdImg} alt="third" />
            <img className={styles.imageItem} src={fourthImg} alt="fourth" />
        </div>
    );
});
