/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useState } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import UploadButton from "../UploadButton/UploadButton";

import styles from "./UploadMultipleImages.module.scss";
import UploadedImage from "../UploadedImage/UploadedImage";
import { galleryApi } from "../../model/services/galleryApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getGalleryImages } from "../../model/selectors/getGalleryImages/getGalleryImages";
import { galleryActions } from "../../model/slice/gallerySlice";
import uploadFile from "@/shared/hooks/files/useUploadFile";

interface UploadMultipleImagesProps {
    className?: string;
    id: string;
    onUpload?: (img: string) => void;
}

export const UploadMultipleImages: FC<UploadMultipleImagesProps> = ({
    className,
    id,
    onUpload,
}) => {
    const [uploadedImg, setUploadedImg] = useState<string[]>([]);
    const [isError, setError] = useState<boolean>(false);
    const { t } = useTranslation("volunteer");

    const dispatch = useAppDispatch();

    const images = useAppSelector(getGalleryImages);

    const handleUpdateImages = useCallback((image: File) => {
        setError(false);
        uploadFile(image.name, image)
            .then((res) => {
                if (res) {
                    dispatch(galleryActions.addImage(res.contentUrl));
                }
            })
            .catch(() => {
                setError(true);
            });
        onUpload?.(image.name);
    }, [onUpload, dispatch]);

    const handleDeleteImg = useCallback((index: number) => {
        setUploadedImg((items) => items.filter((_, i) => i !== index));
    }, []);

    return (
        <>
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.images}>
                    {uploadedImg.map((img, index) => (
                        <UploadedImage
                            onCloseClick={() => handleDeleteImg(index)}
                            key={img}
                            img={img}
                        />
                    ))}
                    <UploadButton onUpload={handleUpdateImages} id={id} />
                </div>
            </div>
            {isError && <p className={styles.error}>{t("volunteer-gallery.Произошла ошибка при загрузке изображения")}</p>}
        </>
    );
};
