import React, {
    FC, memo, useMemo, useState,
} from "react";
import ReactPlayer from "react-player";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import cn from "classnames";

import { Modal } from "@/shared/ui/Modal/Modal";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./VideoGallery.module.scss";
import { Video } from "@/entities/Host/model/types/host";

interface VideoGalleryProps {
    videos: Video[] | string[];
    className?: string;
}

export const VideoGallery: FC<VideoGalleryProps> = memo(
    (props: VideoGalleryProps) => {
        const { videos, className } = props;
        const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
                    onClick={() => setSelectedVideo(video.url)}
                >
                    <ReactPlayer
                        style={{ pointerEvents: "none" }}
                        width="100%"
                        height="180px"
                        url={video.url}
                        light
                        playing={false}
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
                {selectedVideo && (
                    <Modal onClose={() => setSelectedVideo(null)}>
                        <ReactPlayer url={selectedVideo} playing controls />
                    </Modal>
                )}
            </div>
        );
    },
);
