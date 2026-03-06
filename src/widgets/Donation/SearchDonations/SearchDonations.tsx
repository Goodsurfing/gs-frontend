import React, {
    forwardRef,
    useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import searchIcon from "@/shared/assets/icons/search-icon.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.png";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import useDebounce from "@/shared/hooks/useDebounce";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import Button from "@/shared/ui/Button/Button";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import { useLazyGetDonationsQuery } from "@/entities/Donation";
import { AdminSort } from "@/entities/Admin";
import styles from "./SearchDonations.module.scss";

interface SearchDonationsProps {
    onSubmit: (search: string) => void;
    onResetFilters: () => void;
    placeholder?: string;
    buttonText?: string;
    className?: string;
    initialValue?: string;
}

export interface SearchDonationsRef {
    clearSearch: () => void;
}

export const SearchDonations = forwardRef<SearchDonationsRef, SearchDonationsProps>(
    (
        {
            onSubmit, onResetFilters,
            placeholder = "Поиск", buttonText = "Посмотреть все", className,
            initialValue,
        },
        ref,
    ) => {
        const [fetchDonationsDropdown, {
            data: donationsDropdown,
            isLoading: donationsDropdownIsLoading, isFetching: donationsDropdownIsFetching,
        }] = useLazyGetDonationsQuery();
        const isLoading = useMemo(() => donationsDropdownIsLoading
    || donationsDropdownIsFetching, [donationsDropdownIsFetching,
            donationsDropdownIsLoading]);
        const [searchInput, setSearchInput] = useState<string>("");
        const [dropdownVisible, setDropdownVisible] = useState(false);
        const [isDebouncing, setIsDebouncing] = useState(false);
        const debouncedValue = useDebounce(searchInput, 500);

        const containerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);

        const { locale } = useLocale();
        const { t } = useTranslation("donation");

        useImperativeHandle(ref, () => ({
            clearSearch() {
                setSearchInput("");
            },
        }));

        useEffect(() => {
            if (initialValue) {
                setSearchInput(initialValue);
            }
        }, [initialValue]);

        useEffect(() => {
            if (searchInput.trim().length > 0) {
                setIsDebouncing(true);
            } else {
                setDropdownVisible(false);
            }
        }, [searchInput]);

        useEffect(() => {
            const fetchDonations = async () => {
                if (debouncedValue.trim().length > 0) {
                    setIsDebouncing(false);
                    await fetchDonationsDropdown({
                        sort: AdminSort.EndDateDesc,
                        name: debouncedValue,
                    });
                }
            };
            fetchDonations();
        }, [debouncedValue, fetchDonationsDropdown]);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setDropdownVisible(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const handleSubmit = useCallback(() => {
            setDropdownVisible(false);
            onSubmit(searchInput);
        }, [onSubmit, searchInput]);

        const handleClear = useCallback(async () => {
            setSearchInput("");
            await onResetFilters();
        }, [onResetFilters]);

        const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value);
            setDropdownVisible(true);
        }, []);

        return (
            <div ref={containerRef} className={cn(className)} style={{ position: "relative" }}>
                <Paper
                    sx={{
                        p: "3px 6px",
                        border: "1px solid var(--bg-field)",
                        display: "flex",
                        gap: "6px",
                        boxShadow: "none",
                        transition: "border-color 0.2s ease-in-out",
                        "&:focus-within": {
                            borderColor: "var(--accent-color)",
                        },
                    }}
                >
                    <InputBase
                        value={searchInput}
                        onChange={handleInputChange}
                        onClick={() => setDropdownVisible(true)}
                        inputRef={inputRef}
                        sx={{ flex: 1, width: "100%" }}
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        inputProps={{ "aria-label": t("Поиск сборов") }}
                    />
                    {searchInput.length > 0 && <CloseButton onClick={handleClear} />}
                    <IconButton onClick={handleSubmit} type="button" sx={{ p: "10px" }} aria-label="search">
                        <ReactSVG className={styles.searchIcn} src={searchIcon} />
                    </IconButton>
                </Paper>

                {(dropdownVisible && searchInput.length > 0) && (
                    <div className={styles.dropdown}>
                        {(isDebouncing || isLoading) ? (
                            <MiniLoader />
                        ) : (
                            <>
                                {(!!donationsDropdown && donationsDropdown.data.length > 0) ? (
                                    <>
                                        {donationsDropdown.data.slice(0, 3).map((donation) => (
                                            <a
                                                href={getOfferPersonalPageUrl(
                                                    locale,
                                                    String(donation.id),
                                                )}
                                                key={donation.id}
                                                className={cn(styles.dropdownItem)}
                                            >
                                                <img
                                                    src={getMediaContent(
                                                        donation.image?.contentUrl,
                                                    ) || defaultImage}
                                                    alt={donation.name ?? undefined}
                                                />
                                                <div className={styles.dropdownContent}>
                                                    <p className={styles.offerTitle}>
                                                        {
                                                            donation.name
                                                        }
                                                    </p>
                                                    <p className={styles.offerCategory}>
                                                        {donation.organization.name}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </>
                                ) : (
                                    <span>{t("Данные сборы отсутсвуют")}</span>
                                )}
                                <Button
                                    onClick={handleSubmit}
                                    color="BLUE"
                                    size="SMALL"
                                    variant="FILL"
                                >
                                    {buttonText}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    },
);
