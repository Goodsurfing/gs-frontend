import React, {
    FC, FocusEvent, useCallback, useEffect, useRef, useState,
} from "react";
import cn from "classnames";
import {
    FormControl, InputLabel, MenuItem, Select,
} from "@mui/material";
import {
    AdminCourseAuthorFileds, AdminSort, GetAdminUsersResponse, useLazyGetAdminSearchUsersQuery,
} from "@/entities/Admin";
import useDebounce from "@/shared/hooks/useDebounce";
import Input from "@/shared/ui/Input/Input";
import { getFullName } from "@/shared/lib/getFullName";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import styles from "./AdminUsersSearchInput.module.scss";
import { AdminFiltersTable, CustomFilterField } from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";

interface AdminUsersSearchInputProps {
    onChange: (value: AdminCourseAuthorFileds | null) => void;
}

type SearchType = "id" | "email";

interface SearchUserFilters {
    searchType?: SearchType;
}

const offerCustomFields: CustomFilterField<keyof SearchUserFilters>[] = [
    {
        key: "searchType",
        label: "Тип поиска",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="user-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Тип поиска
                </InputLabel>
                <Select
                    labelId="user-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Тип поиска"
                    onChange={(e) => onChange(e.target.value as SearchType)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value="id">Поиск по id пользователя</MenuItem>
                    <MenuItem value="email">Поиск по email пользователя</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminUsersSearchInput: FC<AdminUsersSearchInputProps> = (props) => {
    const { onChange } = props;

    const dropwownRef = useRef(null);

    const [inputValue, setInputValue] = useState<string>("");
    const [filters, setFilters] = useState<SearchUserFilters>({
        searchType: "id",
    });
    const [selectedUser, setSelectedUser] = useState<AdminCourseAuthorFileds | null>(null);
    const [searchedUsers, setSearchedUsers] = useState<GetAdminUsersResponse[]>([]);
    const debouncedValue = useDebounce(inputValue, 500);

    const [getUsers, { isLoading }] = useLazyGetAdminSearchUsersQuery();

    const textTitleInput = filters.searchType === "id" ? "Введите id пользователя" : "Введите email пользователя";

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedValue.length > 3) {
                try {
                    const data = await getUsers({
                        id: filters.searchType === "id" ? debouncedValue : undefined,
                        email: filters.searchType === "email" ? debouncedValue : undefined,
                        limit: 10,
                    }).unwrap();
                    setSearchedUsers(data);
                } catch {
                    setSearchedUsers([]);
                }
            } else {
                setSearchedUsers([]);
            }
        };

        fetchUsers();
    }, [debouncedValue, filters.searchType, getUsers]);

    const handleInputChange = useCallback((v: string) => {
        setInputValue(v);
        setSelectedUser(null);
    }, []);

    const refreshData = useCallback(() => {
        setInputValue("");
        setSearchedUsers([]);
        setSelectedUser(null);
    }, []);

    const onBlur = useCallback((e: FocusEvent<HTMLInputElement, Element>) => {
        if (e.relatedTarget && e.relatedTarget.id === "add-button") {
            return;
        }
        refreshData();
    }, [refreshData]);

    const onClickCard = useCallback((v: AdminCourseAuthorFileds) => {
        setFilters({
            searchType: "id",
        });
        setInputValue(v.id);
        setSelectedUser(v);
    }, []);

    const onAddUser = useCallback(() => {
        if (selectedUser) {
            onChange(selectedUser);
            refreshData();
        }
    }, [onChange, refreshData, selectedUser]);

    const renderUsers = useCallback(
        (users?: GetAdminUsersResponse[]) => {
            if (!users) return null;
            return users.map((user) => (
                <button
                    type="button"
                    key={user.id}
                    onClick={() => onClickCard({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    })}
                    className={styles.wrapperCard}
                >
                    <div className={cn(
                        styles.userCard,
                        { [styles.active]: selectedUser?.id === user.id },
                    )}
                    >
                        <b>{user.id}</b>
                        <p>{getFullName(user.firstName, user.lastName)}</p>
                    </div>
                </button>
            ));
        },
        [onClickCard, selectedUser?.id],
    );

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>
                Добавление автора
            </label>

            <div className={styles.contentWrapper}>
                <div className={styles.inputContainer}>
                    <Input
                        id="input"
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={onBlur}
                        value={inputValue}
                        inputClassName={styles.input}
                        placeholder={textTitleInput}
                    />
                    <div
                        ref={dropwownRef}
                        id="dropdown"
                        className={styles.dropdown}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {renderUsers(searchedUsers)}
                    </div>
                </div>
                <AddButton
                    id="add-button"
                    disabled={!selectedUser || isLoading}
                    text="Добавить автора"
                    onClick={() => onAddUser()}
                />
            </div>
            <div className={styles.filterWrapper}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={() => {}}
                    disabled={isLoading}
                    customFields={offerCustomFields}
                    textButton="Тип поиск пользователя"
                />
            </div>
        </div>
    );
};
