import React from "react";
import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";

import { CoursesList } from "@/widgets/Academy";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import Section from "@/shared/ui/Section/Section";

import { Header } from "../Header/Header";
import styles from "./AcademyMainPage.module.scss";

const AcademyMainPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <Section title="Как это работает?">
                <HowItWorkContainer showButton={false} />
            </Section>
            <Section title="Курсы" classNameWrapper={styles.courseList}>
                <p className={styles.description}>
                    Авторские курсы от экспертов помогут вам научиться новому в
                    путешествиях и волонтерстве. Смотрите, выполняйте домашние
                    задания, получайте сертификацию.
                </p>

                <CoursesList className={styles.list} />
            </Section>
        </div>
    </MainPageLayout>
);

export default AcademyMainPage;
