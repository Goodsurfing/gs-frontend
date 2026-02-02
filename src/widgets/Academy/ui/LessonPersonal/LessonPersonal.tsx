import React, { FC } from "react";
import cn from "classnames";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getSignUpPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import mockCourseImg from "@/shared/assets/images/mock-course.png";
import styles from "./LessonPersonal.module.scss";

interface LessonPersonalProps {
    className?: string;
}

export const LessonPersonal: FC<LessonPersonalProps> = (props) => {
    const { className } = props;
    const { isAuth } = useAuth();
    const { locale } = useLocale();

    if (!isAuth) {
        return (
            <div className={cn(styles.wrapper, styles.notAuth, className)}>
                <p>Видео доступно только для зарегистрированных пользователей</p>
                <ButtonLink path={getSignUpPageUrl(locale)} type="primary" className={styles.button}>
                    Зарегистрироваться
                </ButtonLink>
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <img src={mockCourseImg} alt="Урок" />
        </div>
    );
};
