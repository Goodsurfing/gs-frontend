/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useState } from "react";
import cn from "classnames";

import UploadButton from "../UploadButton/UploadButton";

import styles from "./UploadMultipleImages.module.scss";
import UploadedImage from "../UploadedImage/UploadedImage";
import { galleryApi } from "../../model/services/galleryApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getGalleryImages } from "../../model/selectors/getGalleryImages/getGalleryImages";
import { galleryActions } from "../../model/slice/gallerySlice";

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

    const [generateLink, {
        data, isLoading, isSuccess, isError,
    }] = galleryApi.useGenerateLinkMutation();

    const dispatch = useAppDispatch();

    const images = useAppSelector(getGalleryImages);

    const handleUpdateImages = useCallback((image: File) => {
        generateLink({ fileName: image.name }).unwrap().then((res) => {
            dispatch(galleryActions.addImage(res.url));
        });
        onUpload?.(image.name);
    }, [generateLink, onUpload, dispatch]);

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
            {isError && <p className={styles.error}>Произошла ошибка при загрузке изображения</p>}
        </>
    );
};
