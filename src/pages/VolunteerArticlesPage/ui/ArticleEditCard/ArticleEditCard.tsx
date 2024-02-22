import React, {
    FC, memo, useCallback, useRef, useState,
} from "react";
import cn from "classnames";
import { HandySvg } from "@handy-ones/handy-svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Article } from "@/entities/Article";
import { ArticleWidget } from "@/widgets/ArticleWidget";
import threeDotsIcon from "@/shared/assets/icons/three-dots.svg";
import Popup from "@/components/Popup/Popup";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./ArticleEditCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

interface ArticleEditCardProps {
    article: Article;
    className?: string
}

export const ArticleEditCard: FC<ArticleEditCardProps> = memo((props: ArticleEditCardProps) => {
    const { article, className } = props;
    const { locale } = useLocale();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const popupRef = useRef(null);
    const { t } = useTranslation("volunteer");
    const handleClickOutside = useCallback(() => {
        setIsPopupOpen(false);
    }, []);

    const handleShowPopup = useCallback(() => {
        setIsPopupOpen((prev) => !prev);
    }, []);

    useOnClickOutside(popupRef, handleClickOutside);

    return (
        <div className={cn(className, styles.wrapper)}>
            <ArticleWidget article={article} />
            <div ref={popupRef} className={styles.buttonContent}>
                <button type="button" className={styles.button} onClick={handleShowPopup}>
                    <HandySvg src={threeDotsIcon} />
                </button>
                <Popup className={styles.popup} isOpen={isPopupOpen}>
                    <div className={styles.content}>
                        <Link
                            className={styles.popupButton}
                            to={getMainPageUrl(locale)}
                        >
                            {t("volunteer-articles.Редактировать")}
                        </Link>
                        <button type="button" className={styles.popupButton}>
                            {t("volunteer-articles.Удалить")}
                        </button>
                    </div>
                </Popup>
            </div>
        </div>
    );
});
