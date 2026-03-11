import React from "react";
import { useParams } from "react-router-dom";
import { AdminDonationReportInfo } from "@/widgets/Admin";

const AdminDonationReportPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id отчёта</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminDonationReportInfo reportId={id} />
        </div>
    );
};

export default AdminDonationReportPersonalPage;
