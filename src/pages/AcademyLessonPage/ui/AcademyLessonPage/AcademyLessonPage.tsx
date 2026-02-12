import React from "react";
import { useParams } from "react-router-dom";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { LessonPersonal } from "@/widgets/Academy";

const AcademyLessonPage = () => {
    const { id } = useParams<{ id: string; }>();

    return (
        <MainPageLayout>
            {id && (
                <LessonPersonal lessonId={id} />
            )}
        </MainPageLayout>
    );
};

export default AcademyLessonPage;
