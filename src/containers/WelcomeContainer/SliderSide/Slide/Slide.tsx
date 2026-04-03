import React, { FC } from "react";

import CustomLink from "@/shared/ui/Link/Link";
import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import sliderVolunteerImg from "@/shared/assets/images/slider-volunteer.png";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./Slide.module.scss";

interface SlideProps {
    title: string;
    description?: string;
    text: string;
    image: string;
    buttonLink?: string;
    buttonLinkText?: string;
    locale: Locale;
}

const Slide: FC<SlideProps> = ({
    text, title, image, description,
    locale, buttonLink, buttonLinkText,
}) => (
    <div
        className={styles.slide}
        style={{ backgroundImage: `url(${image})` }}
    >
        <div className={styles.content}>
            <h1>{title}</h1>
            <p>{text}</p>
            {description && (
                <CustomLink to={getSignInPageUrl(locale)} variant="DEFAULT" className={styles.description}>
                    <img src={sliderVolunteerImg} alt="volunteer slide" />
                    <span>{description}</span>
                </CustomLink>
            )}
            {(buttonLink && buttonLinkText) && (
                <ButtonLink className={styles.buttonLink} path={buttonLink} type="secondary">{buttonLinkText}</ButtonLink>
            )}
        </div>
    </div>
);

export default Slide;
