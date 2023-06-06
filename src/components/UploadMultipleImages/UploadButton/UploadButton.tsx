import React, {
    ChangeEvent,
    FC, useCallback,
} from "react";

import plusIcon from "@/assets/icons/plus-icon.svg";

import InputFile from "@/UI/InputFile/InputFile";

import styles from "./UploadButton.module.scss";

interface UploadButtonProps {
    id: string;
    imageUrl: string | undefined;
    onUpload?: (img: string | undefined) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ id, onUpload, imageUrl }) => {
    const handleUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            console.log(file);
            const url = URL.createObjectURL(file);
            onUpload?.(url);
        }
        onUpload?.(e.target.value);
    }, [onUpload]);

    // const [img, setImg] = useState<string | null>(null);

    return (
        <InputFile
            onChange={handleUpload}
            onClick={() => { return console.log("click"); }}
            imageURL={imageUrl}
            id={id}
            labelClassName={styles.btn}
            labelChildren={(
                <div className={styles.innerWrapper}>
                    <img className={styles.icon} src={plusIcon} alt="add item" />
                    <span className={styles.text}>Добавить фото</span>
                </div>
            )}
        />
    );
};

export default UploadButton;
