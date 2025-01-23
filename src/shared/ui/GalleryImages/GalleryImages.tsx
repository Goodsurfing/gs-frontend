import cn from "classnames";
import React, { FC } from "react";
import { ImageType } from "@/components/ImageInput/types";
import ExtraImagesItem from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "@/modules/InviteDescriptionForm/components/PictureReview/PictureReview";
import { GalleryItem, MediaObjectType } from "@/types/media";

import styles from "./GalleryImages.module.scss";
import { getImageDetails, getMediaContent } from "@/shared/lib/getMediaContent";

interface GalleryImagesProps {
    inputImg: ImageType;
    galleryImgs: (GalleryItem | string | MediaObjectType)[];
    label: string;
    isLoading: boolean;
    classNameWrapper?: string;
    handleImageUpload: (img: ImageType) => void;
    handleCloseBtnClick: (imageId: string) => void;
    checkImageSize?: boolean;
}

export const GalleryImages: FC<GalleryImagesProps> = (props) => {
    const {
        classNameWrapper,
        isLoading,
        label,
        handleImageUpload,
        handleCloseBtnClick,
        inputImg,
        galleryImgs,
        checkImageSize,
    } = props;

    return (
        <div className={cn(classNameWrapper, styles.wrapper)}>
            <ExtraImagesItem
                label={label}
                img={inputImg}
                setImg={handleImageUpload}
                id="asd"
                checkImageSize={checkImageSize}
            />
            {galleryImgs.map((image, index) => {
                const { imgUrl, imageId } = getImageDetails(image);

                return (
                    <PictureReview
                        className={styles.imgItem}
                        key={index}
                        img={getMediaContent(imgUrl) ?? ""}
                        isLoading={isLoading}
                        close={(
                            <ExtraImagesItemButton
                                className={styles.closeBtn}
                                onClick={() => handleCloseBtnClick(imageId.toString())}
                            />
                        )}
                    />
                );
            })}
        </div>
    );
};
