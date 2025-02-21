import React, { FC, memo, useMemo } from "react";
import { Navigation } from "swiper";
import cn from "classnames";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./VolunteerCertificatesCard.module.scss";
import { MediaObjectType } from "@/types/media";
import { UploadedCertificate } from "@/features/UploadCertificates";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerCertificatesCardProps {
    classname?: string;
    certificates?: MediaObjectType[];
}

export const VolunteerCertificatesCard: FC<VolunteerCertificatesCardProps> = memo((
    props: VolunteerCertificatesCardProps,
) => {
    const { certificates, classname } = props;

    const renderSlides = useMemo(
        () => {
            if (!certificates) {
                return <span>Здесь будут размещены сертификаты и грамоты волонтера.</span>;
            }
            return certificates.map((certificate, index) => (
                <SwiperSlide className={styles.slide} key={index} style={{ cursor: "pointer" }}>
                    <UploadedCertificate
                        certificate={getMediaContent(certificate) ?? ""}
                        isFile
                        download={getMediaContent(certificate)}
                        disableCloseButton
                        classNameItem={styles.certificate}
                    />
                </SwiperSlide>
            ));
        },
        [certificates],
    );

    return (
        <div id="6" className={cn(classname, styles.wrapper)}>
            <Text title="Сертификаты и грамоты" titleSize="h3" />
            <div className={styles.container}>
                <Swiper
                    className={styles.swiper}
                    wrapperClass={styles.swiperWrapper}
                    navigation
                    modules={[Navigation]}
                    slidesPerView={6}
                    spaceBetween={10}
                    slidesPerGroupAuto
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        400: {
                            slidesPerView: 2,
                        },
                        576: {
                            slidesPerView: 3,
                        },
                        640: {
                            slidesPerView: 4,
                        },
                        768: {
                            slidesPerView: 5,
                        },
                        1000: {
                            slidesPerView: 6,
                        },
                    }}
                >
                    {renderSlides}
                </Swiper>
            </div>
        </div>
    );
});
