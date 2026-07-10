import React from "react";
import { useParams } from "react-router-dom";
import { AdminFeedbackInfo } from "@/widgets/Admin";

const AdminFeedbackPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id обращения</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminFeedbackInfo feedbackId={id} />
        </div>
    );
};

export default AdminFeedbackPersonalPage;
