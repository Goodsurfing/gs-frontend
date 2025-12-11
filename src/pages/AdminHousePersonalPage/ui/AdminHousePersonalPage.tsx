import React from "react";
import { useParams } from "react-router-dom";
import { AdminHouseInfo } from "@/widgets/Admin";

const AdminHousePersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id жилья</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminHouseInfo houseId={Number(id)} />
        </div>
    );
};

export default AdminHousePersonalPage;
