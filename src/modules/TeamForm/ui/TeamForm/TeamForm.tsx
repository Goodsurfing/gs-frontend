import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import Button from "@/shared/ui/Button/Button";

import { fakeUserData } from "../../model/slice/data";
import { TeamUser } from "../../model/types/team";
import { TeamCard } from "../TeamCard/TeamCard";
import { TeamInput } from "../TeamInput/TeamInput";
import { Text } from "../Text/Text";
import styles from "./TeamForm.module.scss";

export const TeamForm = () => {
    const { control } = useForm({ mode: "onChange" });

    // fake data for test
    const [teamUsers, setTeamUsers] = useState<TeamUser[]>(fakeUserData);

    const renderTeamUsers = (teamUsers: TeamUser[]) =>
        teamUsers.map((teamUser) => (
            <TeamCard key={teamUser.id} teamUser={teamUser} />
        ));

    return (
        <div className={styles.wrapper}>
            <Text />
            <Controller
                control={control}
                name="team"
                render={({ field }) => {
                    console.log(field.value);
                    return (
                        <TeamInput
                            inputValue={field.value}
                            onInputChange={field.onChange}
                            teamUsers={teamUsers}
                        />
                    );
                }}
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
