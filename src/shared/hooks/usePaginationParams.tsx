import { useSearchParams } from "react-router-dom";
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
