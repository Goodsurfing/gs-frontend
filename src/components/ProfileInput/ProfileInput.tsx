import cn from "classnames";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import defaultImage from "@/assets/images/default-image-file.png";

import InputFile from "../ui/InputFile/InputFile";
import styles from "./ProfileInput.module.scss";

interface IFileInput {
    fileSizeInMB?: string;
    route?: string;
    text?: string;
    classname?: string;
}

const FileInput: FC<IFileInput> = ({
    fileSizeInMB = "2",
    route,
    text = "Посмотреть профиль",
    classname,
}) => {
    const [isError, setError] = useState<boolean>(false);
    const [fileImage, setFileImage] = useState<string>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0].size > 2097152) {
            e.target.value = "";
            setError(true);
            return;
        }
        if (e.target.files) {
            setError(false);
            const file = URL.createObjectURL(e.target.files[0]);
            setFileImage(file);
        }
    };

    return (
        <div className={cn(classname, styles.wrapper)}>
            {route && <div className={styles.linkWrapper}>
                <Link className={styles.link} to={route}>
                    {text}
                </Link>
            </div>}
            <InputFile
                onChange={handleInputChange}
                id="host-image-upload"
                wrapperClassName={styles.fileWrapper}
                className={styles.file}
                labelClassName={cn(styles.labelClassname, {
                    [styles.labelClassnameActive]: fileImage,
                })}
                labelChildren={
                    <img alt="profile-pic" src={fileImage || defaultImage} />
                }
            />
            <span
                className={cn(styles.size, {
                    [styles.error]: isError,
                })}
            >
                Максимальный размер {fileSizeInMB} Мб
            </span>
        </div>
    );
};

export default React.memo(FileInput);
