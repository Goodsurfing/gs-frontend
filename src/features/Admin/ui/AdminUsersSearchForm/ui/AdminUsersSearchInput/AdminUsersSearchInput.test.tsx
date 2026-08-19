import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import {
    render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import { AdminUsersSearchInput } from "./AdminUsersSearchInput";

/**
 * Поиск ищет только точное совпадение по id/email — пустой результат
 * раньше рендерил реально пустой <div>, а ".dropdown:empty" в стилях
 * прятал его целиком. Человек вводил несуществующий id, ничего
 * визуально не происходило, и выглядело так, будто "поиск не
 * работает" (живая жалоба: не получается добавить автора новости).
 */

vi.mock("@/shared/hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

let searchResult: { id: string; firstName: string; lastName: string }[] = [];
// Ссылка на функцию должна быть стабильной между рендерами: если
// useLazyGetAdminSearchUsersQuery на каждый вызов возвращает НОВЫЙ vi.fn(),
// это на каждый рендер меняет ссылку getUsers — а она в зависимостях
// useEffect в компоненте, так что эффект перезапускается бесконечно
// (пойман вживую: тест реально зависал, а не просто медленно шёл).
const getUsersMock = vi.fn().mockImplementation(() => ({ unwrap: () => Promise.resolve(searchResult) }));

vi.mock("@/entities/Admin", async () => {
    const actual = await vi.importActual<typeof import("@/entities/Admin")>("@/entities/Admin");
    return {
        ...actual,
        useLazyGetAdminSearchUsersQuery: () => [getUsersMock, { isLoading: false }],
    };
});

describe("AdminUsersSearchInput", () => {
    it("shows a not-found message when the search returns no users", async () => {
        searchResult = [];
        render(<AdminUsersSearchInput onChange={vi.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("Введите id пользователя"), {
            target: { value: "019dbeab-5236-7707-840e-f912706445a6" },
        });

        await waitFor(() => {
            expect(screen.getByText("Пользователь не найден")).toBeInTheDocument();
        });
    });

    it("does not show the not-found message when a user is found", async () => {
        searchResult = [{ id: "019dbeab-5236-7707-840e-f912706445a6", firstName: "Иван", lastName: "Иванов" }];
        render(<AdminUsersSearchInput onChange={vi.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("Введите id пользователя"), {
            target: { value: "019dbeab-5236-7707-840e-f912706445a6" },
        });

        await waitFor(() => {
            expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
        });
        expect(screen.queryByText("Пользователь не найден")).not.toBeInTheDocument();
    });
});
