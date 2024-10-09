import cn from "classnames";
import React, { FC } from "react";
import { ImageType } from "@/components/ImageInput/types";
import ExtraImagesItem from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "@/modules/InviteDescriptionForm/components/PictureReview/PictureReview";
import { GalleryItem } from "@/types/media";

import { BASE_URL } from "@/shared/constants/api";

import styles from "./GalleryImages.module.scss";

interface GalleryImagesProps {
    inputImg: ImageType;
    galleryImgs: (GalleryItem | string)[];
    label: string;
    isLoading: boolean;
    classNameWrapper?: string;
    handleImageUpload: (img: ImageType) => void;
    handleCloseBtnClick: (imageId: string) => void;
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
    } = props;

    return (
        <div className={cn(classNameWrapper, styles.wrapper)}>
            <ExtraImagesItem
                label={label}
                img={inputImg}
                setImg={handleImageUpload}
                id="asd"
            />
            {galleryImgs.map((image, index) => {
                const imgUrl = typeof image === "string"
                    ? image
                    : `${BASE_URL}${image.mediaObject.contentUrl.slice(1)}`;

                return (
                    <PictureReview
                        className={styles.imgItem}
                        key={index}
                        img={imgUrl}
                        isLoading={isLoading} // change logic for personal image loading
                        close={(
                            <ExtraImagesItemButton
                                className={styles.closeBtn}
                                onClick={() => handleCloseBtnClick(typeof image === "string" ? "" : image.id.toString())}
                            />
                        )}
                    />
                );
            })}
        </div>
    );
};
