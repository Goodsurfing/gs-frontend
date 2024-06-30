import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";
import { ImageType } from "@/components/ImageInput/types";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import styles from "./ImageUpload.module.scss";
import { DescriptionImage } from "../../model/types/inviteDescription";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { BASE_URL } from "@/shared/constants/api";

interface ImageUploadProps {
    value: DescriptionImage;
    onChange: (value: DescriptionImage) => void;
    childrenLabel: string;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const {
        onChange, childrenLabel, value,
    } = props;
    const { t } = useTranslation("offer");
    const [isImageLoading, setImageLoading] = useState<boolean>(false);

    const handleImageUpload = (image: ImageType) => {
        setImageLoading(true);
        const { file, src } = image;
        onChange({ ...value, image: { src, file } });
        if (file) {
            uploadFile(file.name, file)
                .then((result) => {
                    onChange({
                        uuid: result?.["@id"] || null,
                        image: { file: null, src: `${BASE_URL}${result?.contentUrl.slice(1)}` },
                    });
                })
                .catch(() => {
                    onChange({ uuid: null, image: { file: null, src: null } });
                })
                .finally(() => setImageLoading(false));
        }
    };

    return (
        <ImageInput
            img={value.image}
            setImg={handleImageUpload}
            wrapperClassName={styles.input}
            isLoading={isImageLoading}
            labelClassName={styles.label}
            labelChildren={<ImageUploadBackground text={childrenLabel} />}
            description={(
                <span className={styles.description}>
                    {t(
                        "description.Ширина фотографии для обложки не меньше 1280 пикселей",
                    )}
                </span>
            )}
            id="image-wrapper"
        />
    );
};

export default ImageUpload;
