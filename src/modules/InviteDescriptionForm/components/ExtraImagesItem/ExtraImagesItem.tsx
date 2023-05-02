import React, { FC, useState } from "react";

import ImageInput from "@/components/ImageInput/ImageInput";

import ExtraImagesItemBackground from "./ExtraImagesItemBackground/ExtraImagesItemBackground";
import ExtraImagesItemButton from "./ExtraImagesItemButton/ExtraImagesItemButton";

import { ExtraImagesItemProps } from "./types";

import styles from "./ExtraImagesItem.module.scss";

const ExtraImagesItem: FC<ExtraImagesItemProps> = ({ id, closeBtn }) => {
    const [file, setFile] = useState<File | null>(null);
    
    const onBtnClick = () => {}

    return (
        <div className={styles.wrapper}>
            <ImageInput
                id={id}
                file={file}
                setFile={setFile}
                className={styles.main}
                wrapperClassName={styles.background}
                labelClassName={styles.label}
                labelChildren={<ExtraImagesItemBackground />}
            />            
            {closeBtn && <ExtraImagesItemButton className={styles.closeBtn} onClick={onBtnClick} />}
        </div>

    );
};

export default ExtraImagesItem;
