import React, { FC, memo, useMemo } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./HostVideoGalleryCard.module.scss";

interface VolunteerCertificatesCardProps {
    certificates: string[];
}

export const VolunteerCertificatesCard: FC<VolunteerCertificatesCardProps> = memo((
    props: VolunteerCertificatesCardProps,
) => {
    const { certificates } = props;

    const renderSlides = useMemo(
        () => certificates.map((certificate, index) => (
            <SwiperSlide>
                <img src={certificate} alt="certificate" className={styles.image} key={index} />
            </SwiperSlide>
        )),
        [certificates],
    );

    return (
        <div className={styles.wrapper}>
            <h3>Сертификаты и грамоты</h3>
            <Swiper navigation modules={[Navigation]} className={styles.swiper}>
                {renderSlides}
            </Swiper>
        </div>
    );
});
