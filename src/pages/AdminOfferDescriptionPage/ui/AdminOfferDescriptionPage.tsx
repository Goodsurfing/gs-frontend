import React from "react";
import { useParams } from "react-router-dom";
import { AdminOfferDescription } from "@/widgets/Admin";

import styles from "./AdminOfferDescriptionPage.module.scss";

const AdminOfferDescriptionPage = () => {
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            {id && <AdminOfferDescription offerId={id} />}
        </div>
    );
};

export default AdminOfferDescriptionPage;
