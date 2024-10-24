import React from "react";

import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getProfileRolePagePageUrl } from "@/shared/config/routes/AppUrls";

export const Header = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();

    const onBecomeHostClick = () => {
        navigate(getProfileRolePagePageUrl(locale));
    };

    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>
                Принимай
                у себя гудсёрферов и с их поддержкой развивай свой проект!
            </h1>
            <h2 className={styles.description}>
                Зарегистрируйтесь в сервисе
                Goodsurfing и получите возможность привлекать добровольных помощников со всего мира
            </h2>
            <div className={styles.buttonPrice}>
                <Button color="GREEN" size="SMALL" variant="FILL" onClick={onBecomeHostClick}>
                    Стать хостом
                </Button>
            </div>
        </section>
    );
};
