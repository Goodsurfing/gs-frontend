import cn from "classnames";
import React, { FC, memo } from "react";

import { VideoGallery } from "@/widgets/VideoGallery/ui/VideoGallery/VideoGallery";
import { Video } from "../../model/types/host";
import styles from "./HostVideoGalleryCard.module.scss";

interface HostVideoGalleryCardProps {
    className?: string;
    videoGallery: Video[];
}

export const HostVideoGalleryCard: FC<HostVideoGalleryCardProps> = memo(
    (props: HostVideoGalleryCardProps) => {
        const { videoGallery, className } = props;

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Добавленные видео</h3>
                <VideoGallery videos={videoGallery} className={styles.swiper} />
            </div>
        );
    },
);
