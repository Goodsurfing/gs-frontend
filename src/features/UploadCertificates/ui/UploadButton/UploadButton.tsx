import React, {
    ChangeEvent,
    FC, useCallback, useState,
} from "react";

import { useTranslation } from "react-i18next";
import plusIcon from "@/shared/assets/icons/plus-icon.svg";

import InputFile from "@/shared/ui/InputFile/InputFile";

import styles from "./UploadButton.module.scss";

interface UploadButtonProps {
    id: string;
    onUpload?: (img: File) => void;
}

export const UploadButton: FC<UploadButtonProps> = ({ id, onUpload }) => {
    const [img, setImg] = useState<string>();
    const { t } = useTranslation("volunteer");
    const handleUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            const url = URL.createObjectURL(file);
            setImg(url);
            onUpload?.(file);
        }
    }, [onUpload]);

    return (
        <InputFile
            onChange={handleUpload}
            imageURL={img}
            id={id}
            uploadedImageClassName={styles.hiddenImg}
            labelClassName={styles.btn}
            labelChildren={(
                <div className={styles.innerWrapper}>
                    <img className={styles.icon} src={plusIcon} alt="add item" />
                    <span className={styles.text}>{t("volunteer-gallery.Добавить сертификат")}</span>
                </div>
            )}
        />
    );
};
