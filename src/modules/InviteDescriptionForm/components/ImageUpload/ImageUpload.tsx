import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/ImageInput/ImageInput";
import { galleryApi } from "@/modules/Gallery";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import { ImageType } from "../../model/types/inviteDescription";
import styles from "./ImageUpload.module.scss";
import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";

interface ImageUploadProps {
    value: ImageType;
    onChange: (value: ImageType) => void;
    childrenLabel: string;
}

const ImageUpload: FC<ImageUploadProps> = (props) => {
    const { onChange, childrenLabel, value } = props;
    const [toast, setToast] = useState<ToastAlert>();
    // const [img, setImg] = useState<string | null>(value.url);
    // const [imgFile, setFile] = useState<File | null>(value.file);
    const { t } = useTranslation("offer");

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
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
        </>
    );
};

export default ImageUpload;
