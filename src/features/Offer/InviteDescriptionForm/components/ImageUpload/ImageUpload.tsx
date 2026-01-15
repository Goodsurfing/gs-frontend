import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import styles from "./ImageUpload.module.scss";
import { Image } from "@/types/media";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface ImageUploadProps {
    value: Image | null;
    onChange: (value: Image | null) => void;
    // onChangeLoading: (value: boolean) => void;
    childrenLabel: string;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const {
        onChange, childrenLabel, value,
    } = props;
    const { t } = useTranslation("offer");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSuccess = () => {
        setError(null);
    };

    const onError = (errorValue: string) => {
        setError(errorValue);
    };

    const handleImageUpload = async (file: File) => {
        setIsLoading(true);

        if (file) {
            await uploadFile(file.name, file)
                .then((result) => {
                    if (result) {
                        onChange({
                            id: result.id,
                            contentUrl: result.contentUrl,
                            thumbnails: result.thumbnails,
                        });
                    }
                })
                .catch(() => {
                    onChange(null);
                })
                .finally(() => setIsLoading(false));
        }
    };

    const handleDelete = () => {
        onChange(null);
    };

    return (
        <ImageInput
            img={getMediaContent(value?.contentUrl)}
            setImg={handleImageUpload}
            onDelete={handleDelete}
            wrapperClassName={styles.input}
            isLoading={isLoading}
            labelClassName={styles.label}
            labelChildren={<ImageUploadBackground text={childrenLabel} />}
            onUploadError={onError}
            onSuccess={onSuccess}
            description={(
                <span className={styles.description}>
                    {error && (<ErrorText text={error} />)}
                    {t(
                        "description.Ширина фотографии для обложки не меньше 1280 пикселей",
                    )}
                    <br />
                    {t(
                        "description.Изображение не должно превышать 2 МБ",
                    )}
                </span>
            )}
            id="image-wrapper"
        />
    );
};

export default ImageUpload;
