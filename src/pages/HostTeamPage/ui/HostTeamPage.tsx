import { FC } from "react";

import { TeamForm } from "@/features/TeamForm";
import { useGetMyHostQuery } from "@/entities/Host";
import styles from "./HostTeamPage.module.scss";

const HostTeamPage: FC = () => {
    const { data: hostData } = useGetMyHostQuery();
    return (
        <div className={styles.wrapper}>
            {hostData && (
                <TeamForm hostId={hostData.id} hostEmail={hostData.owner.email} />
            )}
        </div>
    );
};

export default HostTeamPage;
