import cn from "classnames";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import InputFile from "@/shared/ui/InputFile/InputFile";
import { InputFileProps } from "@/shared/ui/InputFile/InputFile.interfaces";
import defaultImage from "@/shared/assets/images/default-image-file.png";
import styles from "./ProfileInput.module.scss";

interface IFileInput extends InputFileProps {
    src: string | undefined;
    setFile: (file: File | undefined) => void;
    fileSizeInMB?: string;
    fileClassname?: string;
    route?: string;
    text?: string;
    classname?: string;
}

const FileInput: FC<IFileInput> = ({
    src,
    setFile,
    fileSizeInMB = "2",
    route,
    text = "Посмотреть профиль",
    classname,
    fileClassname,
    ...restInputProps
}) => {
    const [isError, setError] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0].size > 2097152) {
            e.target.value = "";
            setError(true);
            return;
        }
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(false);
        }
    };

    return (
        <div className={cn(classname, styles.wrapper)}>
            {route && (
                <div className={styles.linkWrapper}>
                    <Link className={styles.link} to={route}>
                        {text}
                    </Link>
                </div>
            )}
            <InputFile
                onChange={handleInputChange}
                wrapperClassName={cn(fileClassname, styles.fileWrapper)}
                className={styles.file}
                labelClassName={cn(styles.labelClassname, {
                    [styles.labelClassnameActive]: src,
                })}
                labelChildren={
                    <img alt="profile-pic" src={src || defaultImage} />
                }
                {...restInputProps}
            />
            <span
                className={cn(styles.size, {
                    [styles.error]: isError,
                })}
            >
                Максимальный размер
                {" "}
                {fileSizeInMB}
                Мб
            </span>
        </div>
    );
};

export default React.memo(FileInput);
