import React, { FC } from "react";
import styles from "./CoursePersonal.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { CourseContent } from "../CourseContent/CourseContent";
import { useGetCourseByIdQuery } from "@/entities/Academy";
import { Header } from "../Header/Header";

interface CoursePersonalProps {
    courseId: string;
}

export const CoursePersonal: FC<CoursePersonalProps> = (props) => {
    const { courseId } = props;
    const { data, isLoading } = useGetCourseByIdQuery(courseId);

    if (isLoading) {
        return (
            <Preloader />
        );
    }

    if (!data) {
        return (
            <MainPageLayout>
                <div className={styles.wrapper}>
                    <p>Курс не был найден</p>
                </div>
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header course={data} />
                <CourseContent course={courseData} />
            </div>
        </MainPageLayout>
    );
};
