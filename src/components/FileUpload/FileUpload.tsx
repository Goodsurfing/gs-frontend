import React, { FC, useState } from "react";

import photoCameraIcon from "@/assets/icons/profile/photo-camera.svg";

import { FileUploadProps } from "./FileUpload.interface";
import styles from "./FileUpload.module.scss";

const FileUpload: FC<FileUploadProps> = ({ id, name, disabled }) => {
    const [selectedImage, setSelectedImage] = useState<File | undefined>();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImage(event.target.files![0]);
        console.log(event.target.files![0]);
    };

    const handleImageDelete = () => {
        setSelectedImage(undefined);
    };

    return (
        <div className={styles.wrapper}>
            <label htmlFor={id} className={styles.label}>
                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Some alt attribute"
                        className={styles.innerImage}
                    />
                )}

                {!selectedImage && (
                    <img
                        src={photoCameraIcon}
                        alt="Upload"
                        className={styles.defaultImage}
                    />
                )}

                <input
                    type="file"
                    name={name}
                    id={id}
                    disabled={disabled}
                    onChange={(event) => {
                        handleInputChange(event);
                    }}
                />
            </label>
            {selectedImage && (
                <button
                    className={styles.removeImage}
                    onClick={handleImageDelete}
                >
                    Удалить фото
                </button>
            )}
        </div>
    );
};

export default FileUpload;
