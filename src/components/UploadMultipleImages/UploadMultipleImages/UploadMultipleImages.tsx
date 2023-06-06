import React, { FC, useState } from "react";
import cn from "classnames";

import UploadButton from "../UploadButton/UploadButton";

import styles from "./UploadMultipleImages.module.scss";
import UploadedImage from "../UploadedImage/UploadedImage";

interface UploadMultipleImagesProps {
    className?: string;
    id: string;
}

export const UploadMultipleImages: FC<UploadMultipleImagesProps> = ({ className, id }) => {
    const [uploadedImg, setUploadedImg] = useState<string>();

    return (
        <div className={cn(className, styles.wrapper)}>
            <UploadButton imageUrl={uploadedImg} onUpload={setUploadedImg} id={id} />
            {uploadedImg && <UploadedImage img={uploadedImg} />}
        </div>
    );
};
