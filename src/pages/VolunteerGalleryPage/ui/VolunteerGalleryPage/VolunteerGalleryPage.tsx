import React from "react";

import { VideoForm } from "@/features/VideoForm";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { TitleCertificate } from "../TitleCertificate/TitleCertificate";
import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import { VolunteerCertificateGallery, VolunteerGallery } from "@/features/Gallery";
import styles from "./VolunteerGalleryPage.module.scss";

const VolunteerGalleryPage = () => {
    const { data: profileData, isLoading } = useGetProfileInfoQuery();

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
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
                        profileId={profileData.id}
                        videoGallery={profileData.videoGallery}
                    />
                    <TitleCertificate className={styles.container} />
                    <VolunteerCertificateGallery
                        profileId={profileData.id}
                        className={styles.container}
                    />
                </>
            )}
        </div>
    );
};

export default VolunteerGalleryPage;
