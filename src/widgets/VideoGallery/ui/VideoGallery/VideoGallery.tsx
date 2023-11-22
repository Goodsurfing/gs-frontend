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

interface VideoGalleryProps {
    videos: string[];
    className?: string;
}

export const VideoGallery: FC<VideoGalleryProps> = memo(
    (props: VideoGalleryProps) => {
        const { videos, className } = props;
        const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

        const renderSlides = useMemo(
            () => videos.map((video, index) => (
                <SwiperSlide key={index}>
                    <ReactPlayer
                        onClick={() => setSelectedVideo(video)}
                        width="330px"
                        url={video}
                        controls
                    />
                </SwiperSlide>
            )),
            [videos],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <Swiper
                    className={styles.swiper}
                    navigation
                    modules={[Navigation]}
                >
                    {renderSlides}
                </Swiper>
                {selectedVideo && (
                    <Modal onClose={() => setSelectedVideo(null)}>
                        <ReactPlayer url={selectedVideo} playing />
                    </Modal>
                )}
            </div>
        );
    },
);
