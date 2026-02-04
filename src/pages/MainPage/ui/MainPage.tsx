import { FC } from "react";

import { useTranslation } from "react-i18next";
import Section from "@/shared/ui/Section/Section";

import BecomeHostContainer from "@/containers/BecomeHostContainer/BecomeHostContainer";
import BenefitsContainer from "@/containers/BenefitsContainer/BenefitsContainer";
import CommunityNewsContainer from "@/containers/CommunityNewsContainer/CommunityNewsContainer";
import { Footer } from "@/widgets/Footer";
import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "@/containers/OffersContainer/OffersContainer";
// import PopularPlacesContainer from "@/containers/PopularPlacesContainer/PopularPlacesContainer";
import ReviewsContainer from "@/containers/ReviewsContainer/ReviewsContainer";
import VolunteerContainer from "@/containers/VolunteerContainer/VolunteerContainer";
import WelcomeContainer from "@/containers/WelcomeContainer/WelcomeContainer";

import Preloader from "@/shared/ui/Preloader/Preloader";
// import { NewMainSliderContainer }
// from "@/containers/NewMainSliderContainer/NewMainSliderContainer";
import styles from "./MainPage.module.scss";

const MainPage: FC = () => {
    const { t, ready } = useTranslation("main");

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <>
            <WelcomeContainer />
            {/* <NewMainSliderContainer /> */}
            <Section title={t("Как это работает?")}>
                <HowItWorkContainer />
            </Section>
            <Section title={t("Интересные вакансии")} className={styles.offersContainer}>
                <OffersContainer />
            </Section>
            <Section title={t("Наши преимущества")}>
                <BenefitsContainer />
            </Section>
            {/* <Section title={t("Популярные места")}>
                <PopularPlacesContainer />
            </Section> */}
            <section className={styles.volunteer}>
                <VolunteerContainer />
            </section>
            <section className={styles.reviews}>
                <ReviewsContainer />
            </section>
            <Section title={t("Новое из Сообщества")}>
                <CommunityNewsContainer />
            </Section>
            <section className={styles.host}>
                <BecomeHostContainer />
            </section>
            <Footer />
        </>
    );
};

export default MainPage;
