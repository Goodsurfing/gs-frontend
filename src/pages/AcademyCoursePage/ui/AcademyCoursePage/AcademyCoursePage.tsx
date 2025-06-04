import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { mockedAcademyCourses } from "@/entities/Academy/model/mockedAcademy.data";

import { CourseContent } from "../CourseContent/CourseContent";
import { Header } from "../Header/Header";
import styles from "./AcademyCoursesPage.module.scss";

const AcademyCoursePage = () => {
    const courseData = mockedAcademyCourses[0];

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header course={courseData} />
                <CourseContent course={courseData} />
            </div>
        </MainPageLayout>
    );
};

export default AcademyCoursePage;
