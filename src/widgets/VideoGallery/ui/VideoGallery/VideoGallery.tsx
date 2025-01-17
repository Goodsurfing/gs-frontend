import React, {
    FC, memo, useMemo,
} from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import cn from "classnames";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./VideoGallery.module.scss";
import { Video } from "@/entities/Host/model/types/host";
import VideoPlayer from "@/shared/ui/VideoPlayer/VideoPlayer";

interface VideoGalleryProps {
    videos: Video[] | string[];
    className?: string;
}

export const VideoGallery: FC<VideoGalleryProps> = memo(
    (props: VideoGalleryProps) => {
        const { videos, className } = props;

        const normalizedVideos = useMemo(
            () => (typeof videos[0] === "string" ? (videos as string[]).map((url) => ({ url })) : (videos as Video[])),
            [videos],
        );

        const renderSlides = useMemo(
            () => normalizedVideos.map((video, index) => (
                <SwiperSlide
                    className={styles.slide}
                    key={index}
                    style={{ cursor: "pointer" }}
                >
                    <VideoPlayer
                        width="100%"
                        height="180px"
                        url={video.url}
                        controls
                    />
                </SwiperSlide>
            )),
            [normalizedVideos],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <Swiper
                    className={styles.swiper}
                    wrapperClass={styles.containerSwiper}
                    navigation
                    modules={[Navigation]}
                    slidesPerView={3}
                    spaceBetween={10}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                    }}
                >
                    {renderSlides}
                </Swiper>
            </div>
        );
    },
);
