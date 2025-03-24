import cn from "classnames";
import React, { FC, useState } from "react";
import { ImageType } from "@/components/ImageInput/types";
import ExtraImagesItem from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "@/modules/InviteDescriptionForm/components/ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "@/modules/InviteDescriptionForm/components/PictureReview/PictureReview";
import { GalleryItem, MediaObjectType } from "@/types/media";

import { getImageDetails, getMediaContent } from "@/shared/lib/getMediaContent";

import { ErrorText } from "../ErrorText/ErrorText";
import styles from "./GalleryImages.module.scss";

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
    const [error, setError] = useState<boolean>(false);

    const onSuccess = () => {
        setError(false);
    };

    const onError = () => {
        setError(true);
    };

    return (
        <div className={cn(classNameWrapper, styles.wrapper)}>
            <div className={styles.imageInputWrapper}>
                <ExtraImagesItem
                    label={label}
                    img={inputImg}
                    setImg={handleImageUpload}
                    id="asd"
                    checkImageSize={checkImageSize}
                    onError={onError}
                    onSuccess={onSuccess}
                />
                {error && (<ErrorText text="Неверный формат файла или ширина фото меньше 1280 пикселей" />)}
            </div>
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
