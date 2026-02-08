import React from "react";
import { useParams } from "react-router-dom";
import { AdminCourseInfo } from "@/widgets/Admin";

const AdminCoursePersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id курса</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminCourseInfo courseId={Number(id)} />
        </div>
    );
};

export default AdminCoursePersonalPage;
