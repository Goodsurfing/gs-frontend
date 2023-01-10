import cn from "classnames";
import React, { FC, useState } from "react";

import photoCameraIcon from "@/assets/icons/profile/photo-camera.svg";

import { ImageUploadProps } from "./ImageUpload.interface";
import styles from "./ImageUpload.module.scss";
import { validImageFileTypes } from "@/constants/files";
import { useUploadFile } from "@/hooks/files/useUploadFile";

const ImageUpload: FC<ImageUploadProps> = ({ id, name, disabled }) => {
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
        setError("");
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

        useUploadFile(selectedImage.name, formData);
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
                    error
                        ? (<p className={styles.error}>{error}</p>)
                        : (
                            <>
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
                            </>
                        )
                }
            </div>
        </div>
    );
};

export default ImageUpload;
