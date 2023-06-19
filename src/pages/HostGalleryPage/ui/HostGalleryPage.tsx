import React, { FC } from "react";

import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";

import { HostPageLayout } from "@/widgets/HostPageLayout";

import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";

import { UploadMultipleImages } from "@/modules/Gallery";

const HostGalleryPage: FC = () => {

    return (
        <HostPageLayout>
            <HostGalleryTitle />
            <UploadMultipleImages id="upload-images" className={styles.imageUpload} />
            <Button disabled className={styles.btn} variant={Variant.PRIMARY} rounded>
                Сохранить
            </Button>
        </HostPageLayout>
    );
};

export default HostGalleryPage;
