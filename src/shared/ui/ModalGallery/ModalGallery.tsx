import React, { FC } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
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

    if (!images || isOpen) {
        return null;
    }

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon
        >
            <Swiper
                modules={[Navigation]}
                initialSlide={initialSlide}
                navigation
                pagination={{ clickable: true }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Slide ${index}`}
                            className={styles.modalImage}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Modal>
    );
};
