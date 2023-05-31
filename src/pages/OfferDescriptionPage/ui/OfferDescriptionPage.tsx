import React from "react";

import styles from "./OfferDescriptionPage.module.scss";

import { InviteDescriptionForm } from "@/modules/InviteDescriptionForm";

const OfferDescriptionPage = () => (
    <div className={styles.wrapper}>
        <InviteDescriptionForm />
    </div>
);

export default OfferDescriptionPage;
