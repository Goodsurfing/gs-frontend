import cn from "classnames";
import React, {
    FC, memo, useEffect,
} from "react";

import { useTranslation } from "react-i18next";
import { getMediaContentsArray } from "@/shared/lib/getMediaContent";

import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerGalleryCard } from "../VolunteerGalleryCard/VolunteerGalleryCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerReviewsCard } from "../VolunteerReviewsCard/VolunteerReviewsCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
import { VolunteerVideoGalleryCard } from "../VolunteerVideoGalleryCard/VolunteerVideoGalleryCard";
import { VolunteerCertificatesCard } from "../VolunteerCertificatesCard/VolunteerCertificatesCard";
import { VolunteerOffersCard } from "../VolunteerOffersCard/VolunteerOffersCard";
import { ProfileById } from "@/entities/Profile";
import { VolunteerHostCard } from "../VolunteerHostCard/VolunteerHostCard";
import { useLazyGetHostByIdQuery } from "@/entities/Host";
import styles from "./VolunteerInfoCard.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface VolunteerInfoCardProps {
    className?: string;
    profileData: ProfileById;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { profileData, className } = props;
        const { t } = useTranslation("profile");
        const [getHost, { data: hostData, isLoading }] = useLazyGetHostByIdQuery();
        const {
            id, volunteer, galleryImages, videoGallery,
        } = profileData;
        const showImageGallery = galleryImages
            && galleryImages.length !== 0;
        const showVideoGallery = videoGallery
            && videoGallery.length !== 0;
        const showCertificates = volunteer && volunteer.certificates.length !== 0;
        const showExternalInfo = volunteer && volunteer.externalInfo
        && volunteer.externalInfo.length !== 0;

        useEffect(() => {
            const fetchHost = () => {
                if (profileData.hostId) {
                    getHost(profileData.hostId);
                }
            };
            fetchHost();
        }, [getHost, profileData.hostId]);

        if (isLoading) {
            return (
                <div className={cn(className)}>
                    <MiniLoader />
                </div>
            );
        }

        return (
            <div className={cn(className)}>
                <VolunteerDesctiptionCard
                    title={t("personal.О себе")}
                    description={profileData?.aboutMe ?? undefined}
                />
                {showExternalInfo && (
                    <VolunteerDesctiptionCard
                        title={t("personal.Дополнительная информация")}
                        description={volunteer?.externalInfo ?? undefined}
                        className={styles.container}
                    />
                )}
                <VolunteerSkillsCard
                    skills={volunteer?.skills}
                    additionalSkills={volunteer?.additionalSkills}
                    className={styles.container}
                />
                {volunteer && (
                    <VolunteerLanguagesCard
                        languages={volunteer.languages}
                        className={styles.container}
                    />
                )}
                {volunteer && (
                    <VolunteerOffersCard
                        offers={volunteer.participatedVacancyIds}
                        className={styles.container}
                    />
                )}
                <VolunteerReviewsCard
                    volunteerId={id}
                    className={styles.container}
                />
                {showImageGallery && (
                    <VolunteerGalleryCard
                        images={getMediaContentsArray(
                            galleryImages,
                        )}
                        className={styles.container}
                    />
                )}
                {showVideoGallery && (
                    <VolunteerVideoGalleryCard
                        videoGallery={videoGallery}
                        className={styles.container}
                    />
                )}
                {showCertificates && (
                    <VolunteerCertificatesCard
                        certificates={volunteer.certificates}
                        classname={styles.container}
                    />
                )}
                {/* <VolunteerArticlesCard
                    articles={volunteer.articles}
                    className={styles.container}
                /> */}
                {hostData && (
                    <VolunteerHostCard host={hostData} className={styles.container} />
                )}
            </div>
        );
    },
);
