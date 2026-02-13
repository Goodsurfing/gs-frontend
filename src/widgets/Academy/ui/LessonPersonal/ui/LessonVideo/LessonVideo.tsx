import React, { FC } from "react";
import cn from "classnames";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./LessonVideo.module.scss";
import VideoPlayer from "@/shared/ui/VideoPlayer/VideoPlayer";

interface LessonVideoProps {
    className?: string;
    videoUrl?: string;
}

export const LessonVideo: FC<LessonVideoProps> = (props) => {
    const { className, videoUrl } = props;
    const { isAuth } = useAuth();
    const { locale } = useLocale();

    if (!isAuth) {
        return (
            <div className={cn(styles.wrapper, styles.notAuth, className)}>
                <p>Видео доступно только для зарегистрированных пользователей</p>
                <ButtonLink path={getSignInPageUrl(locale)} type="primary" className={styles.button}>
                    Авторизоваться
                </ButtonLink>
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            {videoUrl ? (
                <VideoPlayer
                    width="750px"
                    height="424px"
                    url={videoUrl}
                    controls
                    playing={false}
                />
            ) : (
                <p>Видео не было найдено</p>
            )}
        </div>
    );
};
