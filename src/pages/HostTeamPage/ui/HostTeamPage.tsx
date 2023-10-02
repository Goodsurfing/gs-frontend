import { FC } from "react";

import styles from "./HostTeamPage.module.scss";
import { TeamForm } from "@/modules/TeamForm";

const HostTeamPage: FC = () => (
    <div className={styles.wrapper}>
        <TeamForm />
    </div>
);

export default HostTeamPage;
