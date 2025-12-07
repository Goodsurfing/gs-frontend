// src/components/FilterMenuButton.tsx
import React, { ReactNode, useState } from "react";
import {
    Menu,
    MenuItem,
    TextField,
    Select,
    FormControl,
    InputLabel,
    Button,
    Divider,
    Box,
    Typography,
} from "@mui/material";
import styles from "./AdminFiltersTable.module.scss";

export enum FilterSortField {
    IdAsc = "id:asc",
    IdDesc = "id:desc",
    NameAsc = "name:asc",
    NameDesc = "name:desc",
}

export interface BaseFilterFields {
    sort?: FilterSortField;
    id?: number;
    search?: string;
}

export type FilterFields<T = {}> = BaseFilterFields & T;

export interface CustomFilterField<T extends string = string> {
    key: T;
    label: string;
    render: (props: {
        value: any;
        onChange: (value: any) => void;
        disabled?: boolean;
    }) => ReactNode;
}

interface AdminFiltersTableProps<T extends Record<string, any> = {}> {
    filters: Partial<FilterFields<T>>;
    onFilterChange: (filters: Partial<FilterFields<T>>) => void;
    onApply: () => void;
    disabled?: boolean;
    textSearchLabel?: string;
    customFields?: CustomFilterField<keyof T & string>[];
}

export const AdminFiltersTable = <T extends Record<string, any> = {}>({
    filters,
    onFilterChange,
    onApply,
    disabled = false,
    textSearchLabel = "Поиск",
    customFields = [],
}: AdminFiltersTableProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [localFilters, setLocalFilters] = useState<Partial<FilterFields<T>>>(filters);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setLocalFilters(filters);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInputChange = (key: keyof FilterFields<T>, value: any) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value === "" ? undefined : value,
        }));
    };

    const handleApply = () => {
        onFilterChange(localFilters);
        onApply();
        handleClose();
    };

    const handleReset = () => {
        const resetValues: Partial<FilterFields<T>> = {
            sort: FilterSortField.IdAsc,
            id: undefined,
            search: "",
            // Сброс кастомных полей
            ...Object.fromEntries(
                customFields.map((field) => [field.key, undefined]),
            ),
        } as Partial<FilterFields<T>>;

        setLocalFilters(resetValues);
        onFilterChange(resetValues);
        onApply();
        handleClose();
    };

    return (
        <div className={styles.wrapper}>
            <Button
                onClick={handleOpen}
                size="medium"
                disabled={disabled}
                aria-label="Фильтрация"
                variant="outlined"
                sx={{
                    color: "text.secondary",
                    "&:hover": {
                        backgroundColor: "action.hover",
                        color: "text.primary",
                    },
                }}
            >
                Фильтры
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableScrollLock
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: { p: 2, minWidth: 280, borderRadius: 2 },
                    },
                }}
            >
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5 }}>
                    Фильтрация и сортировка
                </Typography>

                {/* Базовое поле: ID */}
                <TextField
                    label="ID"
                    type="number"
                    value={localFilters.id ?? ""}
                    onChange={(e) => handleInputChange("id", e.target.value ? Number(e.target.value) : undefined)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1, step: 1 }}
                    disabled={disabled}
                    sx={{ mb: 1.5 }}
                />

                {/* Базовое поле: Поиск */}
                <TextField
                    label={textSearchLabel}
                    value={localFilters.search ?? ""}
                    onChange={(e) => handleInputChange("search", e.target.value)}
                    fullWidth
                    size="small"
                    disabled={disabled}
                    sx={{ mb: 1.5 }}
                />

                {/* Кастомные поля */}
                {customFields.map((field) => (
                    <div key={field.key} style={{ marginBottom: "12px" }}>
                        {field.render({
                            value: localFilters[field.key],
                            onChange: (value) => handleInputChange(field.key, value),
                            disabled,
                        })}
                    </div>
                ))}
                {/* Сортировка */}
                <FormControl fullWidth size="small" disabled={disabled} sx={{ mb: 1.5 }}>
                    <InputLabel id="filter-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                        Сортировка
                    </InputLabel>
                    <Select
                        labelId="filter-sort-label"
                        value={localFilters.sort || FilterSortField.IdAsc}
                        label="Сортировка"
                        onChange={(e) => handleInputChange("sort", e.target.value)}
                    >
                        <MenuItem value={FilterSortField.IdAsc}>ID ↑</MenuItem>
                        <MenuItem value={FilterSortField.IdDesc}>ID ↓</MenuItem>
                        <MenuItem value={FilterSortField.NameAsc}>Название ↑</MenuItem>
                        <MenuItem value={FilterSortField.NameDesc}>Название ↓</MenuItem>
                    </Select>
                </FormControl>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button variant="text" size="small" onClick={handleReset} disabled={disabled}>
                        Сбросить
                    </Button>
                    <Button variant="contained" size="small" onClick={handleApply} disabled={disabled}>
                        Применить
                    </Button>
                </Box>
            </Menu>
        </div>
    );
};
