import React from "react";

import { VideoForm } from "@/features/VideoForm";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import { VolunteerCertificateGallery, VolunteerGallery } from "@/features/Gallery";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { TitleCertificate } from "../TitleCertificate/TitleCertificate";
import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import styles from "./VolunteerGalleryPage.module.scss";

const VolunteerGalleryPage = () => {
    const { data: profileData, isLoading } = useGetProfileInfoQuery();

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {profileData && (
                <>
                    <TitleGallery />
                    <VolunteerGallery className={styles.container} profileData={profileData} />
                    <TitleVideoGallery className={styles.container} />
                    <VideoForm
                        videoGallery={profileData.videoGallery}
                    />
                    <TitleCertificate className={styles.container} />
                    <VolunteerCertificateGallery
                        profileData={profileData}
                        className={styles.container}
                    />
                </>
            )}
        </div>
    );
};

export default VolunteerGalleryPage;
