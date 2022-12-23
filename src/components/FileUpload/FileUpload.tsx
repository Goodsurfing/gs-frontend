import React, { FC, useRef, useState } from "react";

import fileUploadIcon from "@/assets/icons/profile/photo-camera.svg";

import styles from "./FileUpload.module.scss";

const FileUpload: FC = () => {
    const [, setFileName] = useState<string>("Выберите файл");
    const inputFile = useRef<HTMLInputElement | null>(null);

    const setInputFileName = () => {
        if (inputFile && inputFile.current && inputFile.current.files) {
            setFileName(inputFile.current.files[0].name);
        }
    };

    return (
        <label htmlFor="main" className={styles.inputFile}>
            <input
                name="main"
                type="file"
                ref={inputFile}
                onChange={() => {
                    return setInputFileName();
                }}
            />
            <img src={fileUploadIcon} alt="Загрузить фото" />
        </label>
    );
};

export default FileUpload;
