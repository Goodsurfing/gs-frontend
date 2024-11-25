import cn from "classnames";
import React, { FC, memo } from "react";

import { VideoGallery } from "@/widgets/VideoGallery/ui/VideoGallery/VideoGallery";

import { Video } from "@/entities/Host/model/types/host";

import styles from "./VolunteerVideoGalleryCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerVideoGalleryCardProps {
    className?: string;
    videoGallery?: Video[] | string[];
}

export const VolunteerVideoGalleryCard: FC<VolunteerVideoGalleryCardProps> = memo(
    (props: VolunteerVideoGalleryCardProps) => {
        const { videoGallery, className } = props;

        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title="Добавленные видео" titleSize="h3" />
                {videoGallery ? (
                    <VideoGallery
                        videos={videoGallery}
                        className={styles.swiper}
                    />
                ) : (
                    <span>Здесь будут размещены видео волонтера.</span>
                )}
            </div>
        );
    },
);
