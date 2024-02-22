import { FC } from "react";

import { TeamForm } from "@/features/TeamForm";
import styles from "./HostTeamPage.module.scss";

const HostTeamPage: FC = () => (
    <div className={styles.wrapper}>
        <TeamForm />
    </div>
);

export default HostTeamPage;
