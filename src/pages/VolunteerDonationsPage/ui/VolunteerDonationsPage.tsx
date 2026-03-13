import React from "react";

import { DonationsRecomendationsWidget } from "@/widgets/Donation";
import styles from "./VolunteerDonationsPage.module.scss";

const VolunteerDonationsPage = () => (
    <div className={styles.dashboard}>
        <DonationsRecomendationsWidget />
    </div>
);

export default VolunteerDonationsPage;
