import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminDonationsTable } from "./AdminDonationsTable";

/**
 * Чек-лист правок: тестовый сбор в админке нельзя было закрыть — кнопка
 * "Закрыть сбор" отсутствовала, хотя backend-эндпоинт toggle-status уже
 * существовал. MUI DataGrid не виртуализирует строки в jsdom надёжно
 * (см. AdminOffersTable.test.tsx), поэтому здесь только смоук-тест на то,
 * что таблица со свежим хуком useToggleAdminDonationStatusMutation
 * рендерится без ошибок.
 */

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/entities/Admin", async () => {
    const actual = await vi.importActual<typeof import("@/entities/Admin")>("@/entities/Admin");
    return {
        ...actual,
        useLazyGetAdminDonationsQuery: () => [
            vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() }),
            {
                data: [],
                isLoading: false,
                isFetching: false,
                isError: false,
            },
        ],
        useDeleteAdminDonationMutation: () => [vi.fn(), { isLoading: false }],
        useToggleAdminDonationStatusMutation: () => [vi.fn(), { isLoading: false }],
    };
});

describe("AdminDonationsTable", () => {
    // MUI DataGrid не рендерит содержимое строк (только заголовки) в jsdom
    // без реального layout — см. AdminOffersTable.test.tsx. Кнопка "Закрыть
    // сбор" живёт внутри renderCell строки, поэтому здесь только смоук: с
    // новым хуком useToggleAdminDonationStatusMutation компонент не падает.
    it("рендерится без ошибок с подключённым useToggleAdminDonationStatusMutation", () => {
        render(<AdminDonationsTable />);

        // Действия — крайняя правая колонка, DataGrid не рендерит её в
        // jsdom без реальной ширины контейнера (горизонтальная
        // виртуализация), поэтому проверяем видимую колонку рядом.
        expect(screen.getByText("Название")).toBeInTheDocument();
    });
});
