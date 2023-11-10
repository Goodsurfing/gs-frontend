import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/shared/ui/Button/Button";

import { fakeUserData } from "../../model/data/mockedUserData";
import { TeamUser } from "@/entities/Host/model/types/host";
import { TeamCard } from "../TeamCard/TeamCard";
import { TeamInput } from "../TeamInput/TeamInput";
import { Text } from "../Text/Text";
import styles from "./TeamForm.module.scss";

export const TeamForm = () => {
    const { control } = useForm({ mode: "onChange" });

    // fake data for test
    const [teamUsers] = useState<TeamUser[]>(fakeUserData);

    const renderTeamUsers = (users: TeamUser[]) => users.map((teamUser) => (
        <TeamCard key={teamUser.id} teamUser={teamUser} />
    ));

    return (
        <div className={styles.wrapper}>
            <Text />
            <Controller
                control={control}
                name="team"
                render={({ field }) => (
                    <TeamInput
                        inputValue={field.value}
                        onInputChange={field.onChange}
                        teamUsers={teamUsers}
                    />
                )}
            />
            <div className={styles.containerList}>
                {renderTeamUsers(teamUsers)}
            </div>
            <Button
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Сохранить
            </Button>
        </div>
    );
};
