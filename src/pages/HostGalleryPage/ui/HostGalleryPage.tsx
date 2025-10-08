import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Title as HostGalleryTitle } from "./Title/Title";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HostGallery } from "@/features/Gallery";
import { useGetMyHostQuery } from "@/entities/Host";
import styles from "./HostGalleryPage.module.scss";

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
        </>
    );
};

export default HostGalleryPage;
