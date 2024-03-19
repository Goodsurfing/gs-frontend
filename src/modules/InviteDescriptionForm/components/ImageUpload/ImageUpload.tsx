import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";

import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";
import { galleryApi } from "@/modules/Gallery";
import styles from "./ImageUpload.module.scss";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface ImageUploadProps {
    onChange?: (value: File | null) => void;
    childrenLabel: string;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const { onChange, childrenLabel } = props;
    const [toast, setToast] = useState<ToastAlert>();
    const [img, setImg] = useState<string | null>(null);
    const { t } = useTranslation("offer");
    // const [generateLink, { isLoading }] = galleryApi.useGenerateLinkMutation();

    const handleUploadImage = useCallback((image: File) => {
        console.log(image.name);
        setToast(undefined);
        onChange?.(image);
    }, [onChange]);

    return (
        <>
            {toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            <ImageInput
                img={img}
                setImg={setImg}
                // disabled={isLoading}
                onUpload={handleUploadImage}
                wrapperClassName={styles.input}
                labelClassName={styles.label}
                labelChildren={<ImageUploadBackground text={childrenLabel} />}
                description={(
                    <span className={styles.description}>
                        {t("description.Ширина фотографии для обложки не меньше 1920 пикселей")}
                    </span>
                )}
                id="image-wrapper"
            />
        </>
    );
};

export default ImageUpload;
