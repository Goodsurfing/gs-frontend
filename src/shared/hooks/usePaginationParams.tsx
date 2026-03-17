import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { TagsOption } from "@/features/Article";

interface NewsFilters {
    page: number;
    sort: TagsOption;
    search: string;
    category: number | undefined;
}

interface UseNewsFiltersReturn extends NewsFilters {
    setFilters: (filters: Partial<NewsFilters>) => void;
    setPage: (page: number) => void;
    setSort: (sort: TagsOption) => void;
    setSearch: (search: string) => void;
    setCategory: (category: number | undefined) => void;
}

export const useNewsFilters = (): UseNewsFiltersReturn => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const sort = (searchParams.get("sort") as TagsOption) || "new";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const categoryValue = category ? Number(category) : undefined;

    const setFilters = (filters: Partial<NewsFilters>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            if (filters.page !== undefined) {
                newParams.set("page", String(filters.page));
            }
            if (filters.sort !== undefined) {
                newParams.set("sort", filters.sort);
            }
            if (filters.search !== undefined) {
                if (filters.search) {
                    newParams.set("search", filters.search);
                } else {
                    newParams.delete("search");
                }
            }
            if ("category" in filters) {
                if (filters.category) {
                    newParams.set("category", String(filters.category));
                } else {
                    newParams.delete("category");
                }
            }

            if (filters.sort || filters.search || filters.category) {
                newParams.set("page", "1");
            }

            return newParams;
        });

        window.scrollTo(0, 0);
    };

    return {
        page,
        sort,
        search,
        category: categoryValue,
        setFilters,
        setPage: (newPage) => setFilters({ page: newPage }),
        setSort: (newSort) => setFilters({ sort: newSort }),
        setSearch: (newSearch) => setFilters({ search: newSearch }),
        setCategory: (newCategory) => setFilters({ category: newCategory }),
    };
};

type QueryFilterValue = string | number | undefined;

export const useQueryFilters = <T extends Record<string, QueryFilterValue>>(
    defaults: T,
    options?: { resetPageOnFilterChange?: boolean },
) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const resetPageOnFilterChange = options?.resetPageOnFilterChange ?? true;

    const setFilters = useCallback((newFilters: Partial<T>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            Object.entries(newFilters).forEach(([key, value]) => {
                if (value === undefined || value === "") {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });

            if (resetPageOnFilterChange) {
                const hasNonPageChanges = Object.keys(newFilters).some((k) => k !== "page");
                if (hasNonPageChanges) {
                    newParams.set("page", "1");
                }
            }

            return newParams;
        });

        window.scrollTo(0, 0);
    }, [resetPageOnFilterChange, setSearchParams]);

    const clearFilters = useCallback(() => {
        const defaultParams: Record<string, string> = {};
        Object.entries(defaults).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                defaultParams[key] = String(value);
            }
        });
        setSearchParams(defaultParams);
        window.scrollTo(0, 0);
    }, [defaults, setSearchParams]);

    const filters = useMemo(() => {
        const getParam = <K extends keyof T>(key: K): T[K] => {
            const value = searchParams.get(key as string);
            if (value === null) return defaults[key];
            if (typeof defaults[key] === "number") {
                return Number(value) as T[K];
            }
            return (value || defaults[key]) as T[K];
        };

        const result = {} as T;
        Object.keys(defaults).forEach((key) => {
            result[key as keyof T] = getParam(key as keyof T);
        });
        return result;
    }, [searchParams, defaults]);

    return {
        filters,
        setFilters,
        clearFilters,
    };
};
