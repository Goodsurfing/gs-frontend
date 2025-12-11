// src/components/FilterMenuButton.tsx
import React, { useState } from "react";
import {
    Menu,
    Button,
    Divider,
    Box,
    Typography,
} from "@mui/material";
import styles from "./AdminFiltersTable.module.scss";
import { AdminSort } from "@/entities/Admin";

export interface BaseFilterFields {
    sort?: AdminSort;
    id?: number;
    search?: string;
}

export type FilterFields<T = {}> = T;

export interface CustomFilterField<T extends string = string> {
    key: T;
    label: string;
    render: (props: {
        value: any;
        onChange: (value: any) => void;
        disabled?: boolean;
    }) => React.ReactNode;
}

interface AdminFiltersTableProps<T extends Record<string, any> = {}> {
    filters: Partial<FilterFields<T>>;
    onFilterChange: (filters: Partial<FilterFields<T>>) => void;
    onApply: () => void;
    disabled?: boolean;
    customFields: CustomFilterField<keyof T & string>[];
}

export const AdminFiltersTable = <T extends Record<string, any> = {}>({
    filters,
    onFilterChange,
    onApply,
    disabled = false,
    customFields = [],
}: AdminFiltersTableProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [localFilters, setLocalFilters] = useState<Partial<T>>(filters);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setLocalFilters(filters);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInputChange = (key: keyof T, value: any) => {
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
        const resetValues = Object.fromEntries(
            customFields.map((field) => [field.key, undefined]),
        ) as Partial<T>;

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
                    Фильтрация
                </Typography>

                {/* Только кастомные поля */}
                {customFields.map((field) => (
                    <div key={field.key as string} style={{ marginBottom: "12px" }}>
                        {field.render({
                            value: localFilters[field.key],
                            onChange: (value) => handleInputChange(field.key, value),
                            disabled,
                        })}
                    </div>
                ))}

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
