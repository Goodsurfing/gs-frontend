/* eslint-disable react-hooks/exhaustive-deps */
import {
    FC,
    memo, useCallback, useEffect, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import { useAddMemberToOrganizationMutation } from "@/entities/Host";
import {
    Profile,
} from "@/entities/Profile";

import { API_BASE_URL } from "@/shared/constants/api";
import useDebounce from "@/shared/hooks/useDebounce";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import Input from "@/shared/ui/Input/Input";

import { TeamCard } from "../TeamCard/TeamCard";
// import { HostMember } from "@/entities/Host";
// import { TeamCard } from "../TeamCard/TeamCard";
import styles from "./TeamInput.module.scss";
import { useLazyGetProfileSearchByEmailQuery } from "@/entities/Profile/api/profileApi";

const ITEMS_PER_PAGE = 10;

interface TeamInputProps {
    hostId: string;
    refreshToast: () => void;
    onSuccess: () => void;
    onError: () => void;
}

export const TeamInput: FC<TeamInputProps> = memo((props: TeamInputProps) => {
    const {
        hostId, refreshToast, onSuccess, onError,
    } = props;
    const dropwownRef = useRef(null);
    const { t } = useTranslation("host");
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [searchedProfiles, setSearchedProfiles] = useState<Profile[]>([]);
    const debouncedValue = useDebounce(inputValue, 500);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [getProfileSearchByEmail] = useLazyGetProfileSearchByEmailQuery();
    const [addMemberToOrganization, { isLoading }] = useAddMemberToOrganizationMutation();

    useEffect(() => {
        const fetchProfiles = async () => {
            if (debouncedValue.length > 3) {
                try {
                    const data = await getProfileSearchByEmail({
                        email: debouncedValue,
                        page: 1,
                        itemsPerPage: ITEMS_PER_PAGE,
                    }).unwrap();
                    setSearchedProfiles(data);
                } catch {
                    setSearchedProfiles([]);
                }
            } else {
                setSearchedProfiles([]);
                setPage(1);
                setHasMore(true);
            }
        };

        fetchProfiles();
    }, [debouncedValue]);

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        setSelectedProfile(null);
    }, []);

    const onBlur = useCallback(() => {
        setInputValue("");
        setSearchedProfiles([]);
        setPage(1);
        setHasMore(true);
    }, []);

    const onClickCard = useCallback((profileId: string, email: string) => {
        setInputValue(email);
        setSelectedProfile(`${API_BASE_URL}users/${profileId}`);
    }, []);

    const onAddUserToOrganization = useCallback(() => {
        refreshToast();
        if (selectedProfile) {
            addMemberToOrganization({ organizationId: hostId, body: { profile: selectedProfile } })
                .unwrap()
                .then(() => {
                    onSuccess();
                })
                .catch(() => {
                    onError();
                })
                .finally(() => {
                    setSelectedProfile(null);
                });
        }
    }, [selectedProfile]);

    const renderUsers = useCallback(
        (profiles?: Profile[]) => {
            if (!profiles) return null;
            return profiles.map((profile) => (
                <button
                    type="button"
                    key={profile.id}
                    onClick={() => onClickCard(profile.id, profile.email)}
                    className={styles.wrapperCard}
                >
                    <TeamCard profileData={profile} />
                </button>
            ));
        },
        [onClickCard],
    );

    const fetchMoreProfiles = useCallback(async () => {
        const nextPage = page + 1;
        try {
            const newProfiles = await getProfileSearchByEmail({
                email: debouncedValue,
                page: nextPage,
                itemsPerPage: ITEMS_PER_PAGE,
            }).unwrap();

            if (newProfiles.length > 0) {
                setSearchedProfiles((prev) => {
                    const existingIds = new Set(prev.map((profile) => profile.id));
                    const filteredProfiles = newProfiles.filter(
                        (profile) => !existingIds.has(profile.id),
                    );
                    return [...prev, ...filteredProfiles];
                });
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        }
    }, [page, debouncedValue]);

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>
                {t("hostTeam.Введите ФИО участника")}
            </label>
            <div className={styles.contentWrapper}>
                <div className={styles.inputContainer}>
                    <Input
                        id="input"
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={onBlur}
                        value={inputValue}
                        inputClassName={styles.input}
                    />
                    <InfiniteScroll
                        dataLength={searchedProfiles.length}
                        next={fetchMoreProfiles}
                        hasMore={hasMore}
                        loader={null}
                        scrollableTarget="dropdown"
                    >
                        <div
                            ref={dropwownRef}
                            id="dropdown"
                            className={styles.dropdown}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {renderUsers(searchedProfiles)}
                        </div>
                    </InfiniteScroll>
                </div>
                <AddButton
                    disabled={!selectedProfile || isLoading}
                    text={t("hostTeam.Добавить участника")}
                    onClick={() => onAddUserToOrganization()}
                />
            </div>
        </div>
    );
});
