import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";
import { ImageType } from "@/components/ImageInput/types";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import styles from "./ImageUpload.module.scss";

interface ImageUploadProps {
    value: ImageType;
    onChange: (value: ImageType) => void;
    childrenLabel: string;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const { onChange, childrenLabel, value } = props;
    const { t } = useTranslation("offer");

    return (
        <ImageInput
            img={value}
            setImg={onChange}
            wrapperClassName={styles.input}
            labelClassName={styles.label}
            labelChildren={<ImageUploadBackground text={childrenLabel} />}
            description={(
                <span className={styles.description}>
                    {t(
                        "description.Ширина фотографии для обложки не меньше 1920 пикселей",
                    )}
                </span>
            )}
            id="image-wrapper"
        />
    );
};

export default ImageUpload;
