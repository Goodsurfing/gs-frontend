import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { VideoGallery } from "@/widgets/VideoGallery";
import { Video } from "../../model/types/host";
import styles from "./HostVideoGalleryCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface HostVideoGalleryCardProps {
    className?: string;
    videoGallery: Video[] | string[];
}

export const HostVideoGalleryCard: FC<HostVideoGalleryCardProps> = memo(
    (props: HostVideoGalleryCardProps) => {
        const { videoGallery, className } = props;
        const { t } = useTranslation("host");

        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Видео")} titleSize="h3" />
                <VideoGallery videos={videoGallery} className={styles.swiper} />
            </div>
        );
    },
);
