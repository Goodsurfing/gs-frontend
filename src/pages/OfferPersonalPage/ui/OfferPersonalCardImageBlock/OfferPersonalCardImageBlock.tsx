import { memo } from "react";

import cn from "classnames";

import { useTranslation } from "react-i18next";
import dots from "@/shared/assets/icons/hostPersonal/dots.svg";

import styles from "./OfferPersonalCardImageBlock.module.scss";

interface OfferPersonalCardImageBlockProps {
    className?: string;
    onImagesClick: () => void;
    images: string[];
}

export const OfferPersonalCardImageBlock = memo((props: OfferPersonalCardImageBlockProps) => {
    const { className, onImagesClick, images } = props;
    const { t } = useTranslation("offer");
    return (
        <div onClick={onImagesClick} className={cn(className, styles.wrapper)}>
            <div className={styles.overlay}>
                <img className={styles.dots} src={dots} alt="show more" />
                <span className={styles.dotsText}>{t("personalOffer.Фотографии")}</span>
            </div>
            {images[0] && (
                <img className={styles.imageItem} src={images[0]} alt="first" />
            )}
            {images[1] && (
                <img className={styles.imageItem} src={images[1]} alt="second" />
            )}
            {images[2] && (
                <img className={styles.imageItem} src={images[2]} alt="third" />
            )}
            {images[3] && (
                <img className={styles.imageItem} src={images[3]} alt="fourth" />
            )}
        </div>
    );
});
