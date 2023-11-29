import React, { FC, memo, useMemo } from "react";
import { Navigation } from "swiper";
import cn from "classnames";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./VolunteerCertificatesCard.module.scss";

interface VolunteerCertificatesCardProps {
    classname?: string;
    certificates?: string[];
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
                    <img src={certificate} alt="certificate" className={styles.image} key={index} />
                </SwiperSlide>
            ));
        },
        [certificates],
    );

    return (
        <div className={cn(classname, styles.wrapper)}>
            <h3 className={styles.title}>Сертификаты и грамоты</h3>
            <Swiper
                className={styles.swiper}
                wrapperClass={styles.containerSwiper}
                navigation
                modules={[Navigation]}
                slidesPerView={5}
                spaceBetween={28}
                slidesPerGroupAuto
                breakpoints={{
                    640: {
                        width: 500,
                        slidesPerGroupAuto: true,
                        spaceBetween: 30,
                        slidesPerView: 1,
                    },
                    // when window width is >= 768px
                    768: {
                        width: 803,
                        slidesPerView: 2,
                    },
                }}
            >
                {renderSlides}
            </Swiper>
        </div>
    );
});
