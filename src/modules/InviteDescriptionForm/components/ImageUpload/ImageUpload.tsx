import React, { FC, useState } from "react";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import ImageInput from "@/components/ImageInput/ImageInput";

import styles from "./ImageUpload.module.scss";

const ImageUpload: FC = () => {
    const [file, setFile] = useState<File | null>(null);

    return (
        <ImageInput
            file={file}
            setFile={setFile}
            wrapperClassName={styles.input}
            labelClassName={styles.label}
            labelChildren={<ImageUploadBackground />}
            description={<span className={styles.description}>Ширина фотографии для обложки не меньше 1920 пикселей</span>}
            
            id="image-wrapper"
        />
    );
};

export default ImageUpload;
