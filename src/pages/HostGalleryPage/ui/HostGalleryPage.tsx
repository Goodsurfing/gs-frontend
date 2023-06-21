import React, { FC } from "react";

import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";

import { PageLayout } from "@/widgets/PageLayout";

import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";

import { UploadMultipleImages } from "@/modules/Gallery";
import { HostPagesSidebarData } from "@/shared/data/host-pages";

const HostGalleryPage: FC = () => {
    return (
        <PageLayout sidebarContent={HostPagesSidebarData}>
            <HostGalleryTitle />
            <UploadMultipleImages id="upload-images" className={styles.imageUpload} />
            <Button disabled className={styles.btn} variant={Variant.PRIMARY} rounded>
                Сохранить
            </Button>
        </PageLayout>
    );
};

export default HostGalleryPage;
