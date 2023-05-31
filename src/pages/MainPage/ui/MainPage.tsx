import React, { FC } from "react";

import BecomeHostContainer from "widgets/BecomeHostContainer/BecomeHostContainer";
import BenefitsContainer from "widgets/BenefitsContainer/BenefitsContainer";
import CommunityNewsContainer from "widgets/CommunityNewsContainer/CommunityNewsContainer";
import Footer from "widgets/Footer/Footer";
import HowItWorkContainer from "widgets/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "widgets/OffersContainer/OffersContainer";
import PopularPlacesContainer from "widgets/PopularPlacesContainer/PopularPlacesContainer";
import ReviewsContainer from "widgets/ReviewsContainer/ReviewsContainer";
import VolunteerContainer from "widgets/VolunteerContainer/VolunteerContainer";
import WelcomeContainer from "widgets/WelcomeContainer/WelcomeContainer";

import { Section } from "shared/ui/Section";

import styles from "./MainPage.module.scss";

const MainPage: FC = () => (
    <>
        <WelcomeContainer />
        <Section title="Как это работает?">
            <HowItWorkContainer />
        </Section>
        <Section title="Интересные предложения">
            <OffersContainer />
        </Section>
        <Section title="Наши преимущества">
            <BenefitsContainer />
        </Section>
        <Section title="Популярные места">
            <PopularPlacesContainer />
        </Section>
        <section className={styles.volunteer}>
            <VolunteerContainer />
        </section>
        <section className={styles.reviews}>
            <ReviewsContainer />
        </section>
        <Section title="Новое из Сообщества">
            <CommunityNewsContainer />
        </Section>
        <section className={styles.host}>
            <BecomeHostContainer />
        </section>
        <Footer />
    </>
);

export default MainPage;
