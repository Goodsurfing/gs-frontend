import {
    describe, it, expect, vi, afterEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CommentList } from "./CommentList";
import { Comments } from "../../model/types/articleSchema";

/**
 * До фикса <Comment> рендерился в .map() без key вовсе — React ругался
 * "Each child in a list should have a unique 'key' prop" в консоли на
 * каждой странице блога/журнала/видео/новости с отзывами (общий
 * CommentList для всех четырёх типов контента).
 */

const makeComment = (overrides: Partial<Comments> = {}): Comments => ({
    authorId: "1",
    authorName: "Волонтёр",
    comment: "Отличная поездка!",
    date: "01.01.2026",
    ...overrides,
});

describe("CommentList", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("не выдаёт предупреждение об отсутствующем key при рендере списка", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <MemoryRouter>
                <CommentList
                    locale="ru"
                    comments={[
                        makeComment({ authorId: "1", comment: "Первый отзыв" }),
                        makeComment({ authorId: "2", comment: "Второй отзыв" }),
                    ]}
                />
            </MemoryRouter>,
        );

        const keyWarning = consoleError.mock.calls.some(
            (call) => typeof call[0] === "string" && call[0].includes("unique \"key\" prop"),
        );
        expect(keyWarning).toBe(false);
    });

    it("рендерит все комментарии, включая совпадающие по автору и дате", () => {
        render(
            <MemoryRouter>
                <CommentList
                    locale="ru"
                    comments={[
                        makeComment({ comment: "Первый отзыв" }),
                        makeComment({ comment: "Второй отзыв" }),
                    ]}
                />
            </MemoryRouter>,
        );

        expect(screen.getByText("Первый отзыв")).toBeInTheDocument();
        expect(screen.getByText("Второй отзыв")).toBeInTheDocument();
    });
});
