import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import Button from "@/shared/ui/Button/Button";

import { TeamUser } from "../../model/types/team";
import { TeamCard } from "../TeamCard/TeamCard";
import { TeamInput } from "../TeamInput/TeamInput";
import { Text } from "../Text/Text";
import styles from "./TeamForm.module.scss";

export const TeamForm = () => {
    const { control } = useForm({ mode: "onChange" });

    //fake data for test
    const [teamUsers, setTeamUsers] = useState<TeamUser[]>([
        {
            id: 1,
            name: "Владислав",
            surname: "Краснопольский",
            avatar: defaultAvatarImage,
            email: "example@gmail.com",
            city: "Казань",
            country: "Россия",
            role: "Организатор",
        },
        {
            id: 2,
            name: "Владислав",
            surname: "Краснопольский",
            email: "test@gmail.com",
            avatar: "",
            city: "Казань",
            country: "Россия",
            role: "Участник",
        },
        {
            id: 3,
            name: "Владислав",
            surname: "Краснопольский",
            email: "test1@gmail.com",
            avatar: "",
            city: "Казань",
            country: "Россия",
            role: "Участник",
        },
    ]);

    const renderTeamUsers = (teamUsers: TeamUser[]) =>
        teamUsers.map((teamUser) => {
            return <TeamCard key={teamUser.id} teamUser={teamUser} />;
        });

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
