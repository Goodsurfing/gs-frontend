import React from "react";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { CoursePersonal } from "@/widgets/Academy";

const AcademyCoursePage = () => {
    const { t } = useTranslation("academy");
    const { id } = useParams<{ id: string; }>();

    if (!id) {
        return (
            <p>{t("Был неправильно введён id курса")}</p>
        );
    }

    return (
        <CoursePersonal courseId={id} />
    );
};

export default AcademyCoursePage;
