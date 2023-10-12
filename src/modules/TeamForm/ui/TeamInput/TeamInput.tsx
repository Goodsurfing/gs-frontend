import { memo, useCallback } from "react";

import { AddButton } from "@/shared/ui/AddButton/AddButton";
import Input from "@/shared/ui/Input/Input";

import { TeamUser } from "../../model/types/team";
import { TeamCard } from "../TeamCard/TeamCard";
import styles from "./TeamInput.module.scss";

export interface TeamInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    teamUsers: TeamUser[];
}

export const TeamInput = memo(
    ({ inputValue, onInputChange, teamUsers }: TeamInputProps) => {
        const handleInputChange = useCallback(
            (value: string) => {
                onInputChange(value);
            },
            [onInputChange]
        );

        const onClickCard = (searchTerm: string) => {
            onInputChange(searchTerm);
        };

        const renderUsers = (users: TeamUser[]) =>
            users
                .filter((user) => {
                    const searchTerm = inputValue?.toLowerCase();
                    const userEmail = user.email.toLowerCase();

                    return inputValue && userEmail.startsWith(searchTerm);
                })
                .map((user) => (
                    <div onClick={() => onClickCard(user.email)}>
                        <TeamCard
                            teamUser={user}
                            key={user.id}
                            disableDeleteIcn
                        />
                    </div>
                ));

        return (
            <div className={styles.wrapper}>
                <label htmlFor="input" className={styles.text}>
                    Введите e-mail участника
                </label>
                <div className={styles.contentWrapper}>
                    <div className={styles.inputContainer}>
                        <Input
                            id="input"
                            onChange={(e) => handleInputChange(e.target.value)}
                            value={inputValue}
                            inputClassName={styles.input}
                        />
                        <div className={styles.dropdown}>
                            {renderUsers(teamUsers)}
                        </div>
                    </div>
                    <AddButton
                        disabled={!inputValue}
                        text="Добавить участника"
                    />
                </div>
            </div>
        );
    }
);
