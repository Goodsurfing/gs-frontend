import React, { FC, useCallback, useState } from "react";
import ImageInput from "@/components/ImageInput/ImageInput";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import { galleryApi } from "@/modules/Gallery";
import styles from "./ImageUpload.module.scss";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface ImageUploadProps {
    onChange?: (value: string | undefined) => void;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const { onChange } = props;
    const [toast, setToast] = useState<ToastAlert>();
    const [img, setImg] = useState<string | null>(null);
    const [generateLink, { isLoading }] = galleryApi.useGenerateLinkMutation();

    const handleUploadImage = useCallback((image: File) => {
        console.log(image.name);
        setToast(undefined);
        generateLink({ fileName: image.name })
            .unwrap()
            .then((res) => {
                onChange?.(res.url);
            })
            .catch((error) => {
                setToast({
                    text: "Произошла ошибка при загрузке изображения",
                    type: HintType.Error,
                });
                console.log("error upload", error);
            });
    }, [generateLink, onChange]);

    return (
        <>
            {toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            <ImageInput
                img={img}
                setImg={setImg}
                disabled={isLoading}
                onUpload={handleUploadImage}
                wrapperClassName={styles.input}
                labelClassName={styles.label}
                labelChildren={<ImageUploadBackground />}
                description={(
                    <span className={styles.description}>
                        Ширина фотографии для обложки не меньше 1920
                        пикселей
                    </span>
                )}
                id="image-wrapper"
            />
        </>
    );
};

export default ImageUpload;
