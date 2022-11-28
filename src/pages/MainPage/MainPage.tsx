import React, { FC } from "react";

import Section from "@/components/ui/Section/Section";

import WelcomeContainer from "@/containers/WelcomeContainer/WelcomeContainer";

const MainPage: FC = () => {
    return (
        <>
            <WelcomeContainer />
            <Section title={"Как это работает?"}></Section>
        </>
    );
};

export default MainPage;
