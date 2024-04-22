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
    videos: Video[];
    className?: string;
}

export const VideoGallery: FC<VideoGalleryProps> = memo(
    (props: VideoGalleryProps) => {
        const { videos, className } = props;
        const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

        const renderSlides = useMemo(
            () => videos.map((video, index) => (
                <SwiperSlide className={styles.slide} key={index} style={{ cursor: "pointer" }} onClick={() => setSelectedVideo(video.url)}>
                    <ReactPlayer
                        style={{ pointerEvents: "none" }}
                        width="330px"
                        height="193px"
                        url={video.url}
                        light
                        playing={false}
                    />
                </SwiperSlide>
            )),
            [videos],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <Swiper
                    className={styles.swiper}
                    wrapperClass={styles.containerSwiper}
                    navigation
                    modules={[Navigation]}
                    slidesPerView={2}
                    spaceBetween={150}
                    breakpoints={{
                        640: {
                            width: 500,
                            slidesPerGroupAuto: true,
                            spaceBetween: 30,
                            slidesPerView: 1,
                        },
                        // when window width is >= 768px
                        768: {
                            width: 803,
                            slidesPerView: 2,
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
