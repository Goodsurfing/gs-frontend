import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import ReactPlayer from "react-player";
import { Navigation } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import styles from "./HostVideoGalleryCard.module.scss";

interface HostVideoGalleryCardProps {
    className?: string;
    videoGallery: string[];
}

export const HostVideoGalleryCard: FC<HostVideoGalleryCardProps> = memo(
    (props: HostVideoGalleryCardProps) => {
        const { videoGallery, className } = props;

        const renderSlides = useMemo(
            () => videoGallery.map((video, index) => (
                <SwiperSlide>
                    <ReactPlayer
                        key={index}
                        width="330px"
                        url={video}
                        controls
                    />
                </SwiperSlide>
            )),
            [videoGallery],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Добавленные видео</h3>
                <Swiper className={styles.swiper} navigation modules={[Navigation]}>
                    {renderSlides}
                </Swiper>
            </div>
        );
    },
);
