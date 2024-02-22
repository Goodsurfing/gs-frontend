import cn from "classnames";
import React, {
    FC, memo, useMemo, useState,
} from "react";

import { Modal } from "@/shared/ui/Modal/Modal";

import { ImageSwiper } from "../ImageSwiper/ImageSwiper";
import styles from "./ImageGallery.module.scss";

interface ImageGalleryProps {
    images: string[];
    className?: string;
}

const RENDER_TWELVE_CARDS = [0, 12];

export const ImageGallery: FC<ImageGalleryProps> = memo(
    (props: ImageGalleryProps) => {
        const { images, className } = props;
        const [selectedImage, setSelectedImage] = useState<number | null>(null);

        const renderImages = useMemo(
            () => images
                .slice(...RENDER_TWELVE_CARDS)
                .map((image, index) => (
                    <img
                        src={image}
                        alt="gallery"
                        className={styles.image}
                        onClick={() => setSelectedImage(index)}
                        key={index}
                    />
                )),
            [images],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                {renderImages}
                {selectedImage !== null && (
                    <Modal onClose={() => setSelectedImage(null)}>
                        <ImageSwiper
                            images={images}
                            initialSlide={selectedImage}
                        />
                    </Modal>
                )}
            </div>
        );
    },
);
