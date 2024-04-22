import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";
import { ImageType } from "@/components/ImageInput/types";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import styles from "./ImageUpload.module.scss";
import { DescriptionImage } from "../../model/types/inviteDescription";

interface ImageUploadProps {
    value: DescriptionImage;
    onChange: (value: DescriptionImage) => void;
    childrenLabel: string;
    isLoading?: boolean
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const {
        onChange, childrenLabel, value, isLoading,
    } = props;
    const { t } = useTranslation("offer");

    const handleImageUpload = (image: ImageType) => {
        onChange({ uuid: null, image });
    };

    return (
        <ImageInput
            img={value.image}
            setImg={handleImageUpload}
            wrapperClassName={styles.input}
            isLoading={isLoading}
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
