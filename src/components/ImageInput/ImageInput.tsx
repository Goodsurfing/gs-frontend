import InputFile from "@/UI/InputFile/InputFile";
import cn from "classnames";
import React, { FC, useCallback, useState } from "react";

import styles from "./ImageInput.module.scss";
import { ImageInputComponentProps } from "./types";
import { checkWidthAndHeight } from "@/utils/files/checkWidthAndHeight";

const ImageInput: FC<ImageInputComponentProps> = ({
    file,
    setFile,
    id,
    description,
    labelChildren,
    wrapperClassName,
    labelClassName,
    ...restInputProps
}) => {
    const [error, setError] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string>();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            try {
                const size = await checkWidthAndHeight(file);
                console.log(size)
                if (size.width < 1920 || size.height < 1080) {
                    setError(true);
                    return;
                }
                const url = URL.createObjectURL(file);
                
                setFile(file);
                setImageURL(url)
            } catch (e) {
                setError(true);
                console.log("Error ", e);
            }
            
        }
    };

    return (
        <>
            <InputFile
                onChange={handleFileChange}
                imageURL={imageURL}
                uploadedImageClassName={styles.uploadedImg}
                wrapperClassName={cn(styles.wrapper, wrapperClassName)}
                labelClassName={cn(styles.label, labelClassName)}
                labelChildren={labelChildren}
                id={id}
                {...restInputProps}
            />
            {description}
        </>
    );
};

export default React.memo(ImageInput);
