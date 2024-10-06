import { FC } from "react";

import { TeamForm } from "@/features/TeamForm";
import styles from "./HostTeamPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host";

const HostTeamPage: FC = () => {
    const { data: hostData } = useGetMyHostQuery();
    return (
        <div className={styles.wrapper}>
            {hostData?.id && (
                <TeamForm hostId={hostData.id} />
            )}
        </div>
    );
};

export default HostTeamPage;
