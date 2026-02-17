import React from "react";

import { useParams } from "react-router-dom";
import { CoursePersonal } from "@/widgets/Academy";

const AcademyCoursePage = () => {
    const { id } = useParams<{ id: string; }>();

    if (!id) {
        return (
            <p>Был неправильно введён id курса</p>
        );
    }

    return (
        <CoursePersonal courseId={id} />
    );
};

export default AcademyCoursePage;
