import cn from "classnames";
import React, { FC, useState } from "react";

import photoCameraIcon from "@/assets/icons/profile/photo-camera.svg";

import { FileUploadProps } from "./FileUpload.interface";
import styles from "./FileUpload.module.scss";
import { validImageFileTypes } from "@/constants/files";

const FileUpload: FC<FileUploadProps> = ({ id, name, disabled }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>();
    const [error, setError] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file) {
            if (!validImageFileTypes.find((type) => { return type === file.type; })) {
                setError("Данный тип файла не поддерживается");
                return;
            }
        }
        setSelectedImage(file);
    };

    const handleImageDelete = () => {
        setSelectedImage(undefined);
    };

    const handleConfirm = () => {
        if (!selectedImage) {
            return;
        }

        const formData = new FormData();
        formData.append("avatar", selectedImage);
    };

    return (
        <div className={styles.wrapper}>
            <label
                htmlFor={id}
                className={cn(styles.label, {
                    [styles.disabled]: disabled,
                })}
            >
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
            <div className={styles.options}>
                {
                    error && (
                        <p>{error}</p>
                    )
                }
                {selectedImage && (
                    <button
                        className={styles.confirmImage}
                        onClick={handleConfirm}
                    >
                        Подтвердить
                    </button>
                )}
                {selectedImage && (
                    <button
                        className={styles.removeImage}
                        onClick={handleImageDelete}
                    >
                        Удалить фото
                    </button>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
