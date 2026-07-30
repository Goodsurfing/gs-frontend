import React, { FC, useState } from "react";
import cn from "classnames";
import { Image } from "@/types/media";
import { getMediaContent, getMediaContentsArray } from "@/shared/lib/getMediaContent";
import { ModalGallery } from "../ModalGallery/ModalGallery";
import styles from "./ReviewGallery.module.scss";

interface ReviewGalleryProps {
    images?: Image[];
    className?: string;
    maxVisible?: number;
}

export const ReviewGallery: FC<ReviewGalleryProps> = (props) => {
    const { images, className, maxVisible = 4 } = props;
    const [isModalOpen, setModalOpen] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const visibleImages = images.slice(0, maxVisible);
    const hiddenCount = images.length - visibleImages.length;

    const openGallery = (index: number) => {
        setInitialSlide(index);
        setModalOpen(true);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {visibleImages.map((image, index) => {
                const isLastVisible = index === visibleImages.length - 1;

                return (
                    <button
                        type="button"
                        key={image.id}
                        className={styles.thumbWrapper}
                        onClick={() => openGallery(index)}
                    >
                        <img
                            className={styles.thumb}
                            src={getMediaContent(image, "SMALL")}
                            alt="review"
                        />
                        {isLastVisible && hiddenCount > 0 && (
                            <span className={styles.more}>
                                {`+${hiddenCount}`}
                            </span>
                        )}
                    </button>
                );
            })}
            <ModalGallery
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                images={getMediaContentsArray(images)}
                initialSlide={initialSlide}
            />
        </div>
    );
};
