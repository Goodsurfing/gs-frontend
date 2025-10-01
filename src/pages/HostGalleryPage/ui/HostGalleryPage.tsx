import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";
// import { HostGalleryForm } from "@/features/HostGalleryForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HostGallery } from "@/features/Gallery";
import { useGetMyHostQuery } from "@/entities/Host";

const HostGalleryPage: FC = () => {
    const { ready } = useTranslation("host");
    const { data: myHost } = useGetMyHostQuery();

    if (!ready) {
        return (<MiniLoader />);
    }

    return (
        <>
            <HostGalleryTitle />
            {myHost && (
                <HostGallery className={styles.imageUpload} hostData={myHost} />
            )}
            {/* <HostGalleryForm className={styles.imageUpload} /> */}
        </>
    );
};

export default HostGalleryPage;
