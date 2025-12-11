import React from "react";
import { useParams } from "react-router-dom";
import { AdminSkillInfo } from "@/widgets/Admin";

const AdminSkillPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id навыка</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminSkillInfo skillId={Number(id)} />
        </div>
    );
};

export default AdminSkillPersonalPage;
