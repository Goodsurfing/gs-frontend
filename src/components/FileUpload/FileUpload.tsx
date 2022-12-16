import React, { FC, useRef, useState } from "react";

import fileUploadIcon from "@/assets/icons/profile/photo-camera.svg";

import styles from "./FileUpload.module.scss";

const FileUpload: FC = () => {
    const [fileName, setFileName] = useState<string>("Выберите файл");
    const inputFile = useRef<HTMLInputElement | null>(null);

    const setInputFileName = () => {
        if (inputFile && inputFile.current && inputFile.current.files) {
            setFileName(inputFile.current.files[0].name);
        }
    };

    return (
        <label className={styles.inputFile}>
            <input
                type="file"
                ref={inputFile}
                onChange={() => setInputFileName()}
            />
            <img src={fileUploadIcon} alt="Загрузить фото" />
        </label>
    );
};

export default FileUpload;
