import React, { FC } from "react";

import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";

import { PageLayout } from "@/widgets/PageLayout";

import Button from "@/shared/ui/Button/Button";

import { UploadMultipleImages } from "@/modules/Gallery";
import { HostPagesSidebarData } from "@/shared/data/sidebar/host-pages";

const HostGalleryPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
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
    </PageLayout>
);

export default HostGalleryPage;
