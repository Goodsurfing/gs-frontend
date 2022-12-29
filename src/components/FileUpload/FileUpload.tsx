import React, { FC, useState } from "react";

import { FileUploadProps } from "./FileUpload.interface";
import styles from "./FileUpload.module.scss";

const FileUpload: FC<FileUploadProps> = ({ id, name, disabled }) => {
    const [selectedImage, setSelectedImage] = useState<Blob | MediaSource>();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImage(event.target.files![0]);
        console.log(event.target.files![0]);
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
        </div>
    );
};

export default FileUpload;
