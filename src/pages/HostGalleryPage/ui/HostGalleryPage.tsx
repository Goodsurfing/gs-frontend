import React, { FC } from "react";

import { Title as HostGalleryTitle } from "./Title/Title";

import Button from "@/shared/ui/Button/Button";

import { UploadMultipleImages } from "@/modules/Gallery";

import styles from "./HostGalleryPage.module.scss";

const HostGalleryPage: FC = () => (
    <>
        <HostGalleryTitle />
        <UploadMultipleImages id="upload-images" className={styles.imageUpload} />
        <Button
            disabled
            color="BLUE"
            variant="FILL"
            size="MEDIUM"
            className={styles.btn}
        >
            Сохранить
        </Button>
    </>
);

export default HostGalleryPage;
