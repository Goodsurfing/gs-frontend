import React from "react";
import { useParams } from "react-router-dom";
import { AdminTransferInfo } from "@/widgets/Admin";

const AdminTransferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id оплачеваемого проезда</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminTransferInfo transferId={Number(id)} />
        </div>
    );
};

export default AdminTransferPersonalPage;
