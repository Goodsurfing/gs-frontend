import React, { FC } from "react";

import Section from "@/components/ui/Section/Section";

import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "@/containers/OffersContainer/OffersContainer";
import WelcomeContainer from "@/containers/WelcomeContainer/WelcomeContainer";

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
        </>
    );
};

export default MainPage;
