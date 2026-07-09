import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { DragDropContext } from "react-beautiful-dnd";
import { NotesContainer } from "./NotesContainer";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-guard для row 101: заголовок колонки CRM показывал
 * notes.length (количество заявок на ТЕКУЩЕЙ странице общего списка),
 * а не реальный total этого статуса по всем страницам.
 */
describe("NotesContainer — счётчик в заголовке колонки", () => {
    it("показывает total, если он передан, а не notes.length", () => {
        render(
            <DragDropContext onDragEnd={() => {}}>
                <NotesContainer
                    notes={[]}
                    color="#000"
                    status="new"
                    isDragDisable={false}
                    variant="host"
                    onReviewClick={() => {}}
                    locale="ru"
                    total={37}
                />
            </DragDropContext>,
        );

        expect(screen.getByText("37")).toBeInTheDocument();
    });

    it("падает обратно на notes.length, если total не передан (обратная совместимость)", () => {
        render(
            <DragDropContext onDragEnd={() => {}}>
                <NotesContainer
                    notes={[]}
                    color="#000"
                    status="new"
                    isDragDisable={false}
                    variant="host"
                    onReviewClick={() => {}}
                    locale="ru"
                />
            </DragDropContext>,
        );

        expect(screen.getByText("0")).toBeInTheDocument();
    });
});
