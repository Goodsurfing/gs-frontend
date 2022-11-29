import React, { FC } from "react";

import Section from "@/components/ui/Section/Section";

import BenefitsContainer from "@/containers/BenefitsContainer/BenefitsContainer";
import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "@/containers/OffersContainer/OffersContainer";
import PopularPlacesContainer from "@/containers/PopularPlacesContainer/PopularPlacesContainer";
import ReviewsContainer from "@/containers/ReviewsContainer/ReviewsContainer";
import VolunteerContainer from "@/containers/VolunteerContainer/VolunteerContainer";
import WelcomeContainer from "@/containers/WelcomeContainer/WelcomeContainer";

import styles from "./MainPage.module.scss";

const MainPage: FC = () => {
    return (
        <>
            <WelcomeContainer />
            <Section title={"Как это работает?"}>
                <HowItWorkContainer />
            </Section>
            <Section title={"Интересные предложения"}>
                <OffersContainer />
            </Section>
            <Section title={"Наши преимущества"}>
                <BenefitsContainer />
            </Section>
            <Section title={"Популярные места"}>
                <PopularPlacesContainer />
            </Section>
            <section className={styles.volunteer}>
                <VolunteerContainer />
            </section>
            <section className={styles.reviews}>
                <ReviewsContainer />
            </section>
        </>
    );
};

export default MainPage;
