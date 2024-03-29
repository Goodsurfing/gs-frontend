import {
    memo, useCallback, useRef,
} from "react";

import { AddButton } from "@/shared/ui/AddButton/AddButton";
import Input from "@/shared/ui/Input/Input";

import { TeamUser } from "@/entities/Host";
import { TeamCard } from "../TeamCard/TeamCard";
import styles from "./TeamInput.module.scss";

export interface TeamInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    teamUsers: TeamUser[];
}

export const TeamInput = memo(
    ({ inputValue, onInputChange, teamUsers }: TeamInputProps) => {
        const dropwownRef = useRef(null);

        const handleInputChange = useCallback(
            (value: string) => {
                onInputChange(value);
            },
            [onInputChange],
        );

        const onClickCard = useCallback((searchTerm: string) => {
            onInputChange(searchTerm);
        }, [onInputChange]);

        const renderUsers = useCallback((users: TeamUser[]) => users
            .filter((user) => {
                const searchTerm = inputValue?.toLowerCase();
                const userEmail = user.email.toLowerCase();

                return inputValue && userEmail.startsWith(searchTerm);
            })
            .map((user) => (
                <button type="button" onClick={() => onClickCard(user.email)} className={styles.wrapperCard}>
                    <TeamCard
                        teamUser={user}
                        key={user.id}
                        disableDeleteIcn
                    />
                </button>
            )), [inputValue, onClickCard]);

        return (
            <div className={styles.wrapper}>
                <label htmlFor="input" className={styles.text}>
                    Введите e-mail участника
                </label>
                <div className={styles.contentWrapper}>
                    <div className={styles.inputContainer}>
                        <Input
                            inputMode="url"
                            id="input"
                            onChange={(e) => handleInputChange(e.target.value)}
                            value={inputValue}
                            inputClassName={styles.input}
                        />
                        <div
                            ref={dropwownRef}
                            className={styles.dropdown}
                        >
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
    },
);
