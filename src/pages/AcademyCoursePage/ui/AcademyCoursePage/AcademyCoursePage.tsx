import React from "react";
import styles from "./AcademyCoursesPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { mockedAcademyCourses } from "@/entities/Academy/model/mockedAcademy.data";

const AcademyCoursePage = () => {
    const courseData = mockedAcademyCourses[0];

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header course={courseData} />
            </div>
        </MainPageLayout>
    );
};

export default AcademyCoursePage;
