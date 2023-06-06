import React, { FC, useCallback, useState } from "react";
import cn from "classnames";

import UploadButton from "../UploadButton/UploadButton";

import styles from "./UploadMultipleImages.module.scss";
import UploadedImage from "../UploadedImage/UploadedImage";

interface UploadMultipleImagesProps {
    className?: string;
    id: string;
}

export const UploadMultipleImages: FC<UploadMultipleImagesProps> = ({ className, id }) => {
    const [uploadedImg, setUploadedImg] = useState<string[]>([]);

    const handleUpdateImages = useCallback((img: string) => {
        setUploadedImg((prev) => {
            return [...prev, img];
        });
    }, []);

    const handleDeleteImg = useCallback((index: number) => {
        setUploadedImg((items) => {
            return items.filter((_, i) => {
                return i !== index;
            });
        });
    }, []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <UploadButton onUpload={handleUpdateImages} id={id} />
            {uploadedImg.map((img, index) => {
                return (
                    <UploadedImage
                        onCloseClick={() => { return handleDeleteImg(index); }}
                        key={img}
                        img={img}
                    />
                );
            })}
        </div>
    );
};
