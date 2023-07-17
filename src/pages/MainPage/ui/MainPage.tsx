import { FC } from "react";

import Section from "@/shared/ui/Section/Section";

import BecomeHostContainer from "@/containers/BecomeHostContainer/BecomeHostContainer";
import BenefitsContainer from "@/containers/BenefitsContainer/BenefitsContainer";
import CommunityNewsContainer from "@/containers/CommunityNewsContainer/CommunityNewsContainer";
import Footer from "@/containers/Footer/Footer";
import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "@/containers/OffersContainer/OffersContainer";
import PopularPlacesContainer from "@/containers/PopularPlacesContainer/PopularPlacesContainer";
import ReviewsContainer from "@/containers/ReviewsContainer/ReviewsContainer";
import VolunteerContainer from "@/containers/VolunteerContainer/VolunteerContainer";
import WelcomeContainer from "@/containers/WelcomeContainer/WelcomeContainer";

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
