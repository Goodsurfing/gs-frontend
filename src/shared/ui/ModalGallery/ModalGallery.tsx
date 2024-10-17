import React, { FC } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import useWindowDimensions from "@/shared/hooks/useWindowDimensions";

import { Modal } from "../Modal/Modal";
import styles from "./ModalGallery.module.scss";

interface GalleryModalProps {
    images?: string[];
    initialSlide?: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ModalGallery: FC<GalleryModalProps> = (props) => {
    const {
        onClose, images, initialSlide = 0, isOpen,
    } = props;
    const { width } = useWindowDimensions();

    if (!images || !isOpen) {
        return null;
    }

    const renderImageZoom = (image: string, index: number) => {
        if (width <= 768) {
            return (
                <Zoom>
                    <img
                        src={image}
                        alt={`Slide ${index}`}
                        className={styles.modalImage}
                    />
                </Zoom>
            );
        }
        return (
            <img
                src={image}
                alt={`Slide ${index}`}
                className={styles.modalImage}
            />
        );
    };

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.wrapper}>
                <Swiper
                    modules={[Navigation]}
                    initialSlide={initialSlide}
                    navigation
                    wrapperClass={styles.swiperWrapper}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            {renderImageZoom(image, index)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </Modal>
    );
};
