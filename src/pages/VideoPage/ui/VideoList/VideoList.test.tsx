import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoList } from "./VideoList";

/**
 * Баг с живого стейджа: при пустом результате фильтра по категории
 * (`data` — пустой массив, не undefined) компонент проверял только
 * `!data`, пустой массив truthy в JS, так что никакое сообщение не
 * показывалось вообще — просто пустое место.
 */
describe("VideoList", () => {
    it("показывает сообщение, если данные загрузились, но список пуст", () => {
        render(<VideoList data={[]} />);
        expect(screen.getByText("Видео не найдены")).toBeInTheDocument();
    });

    it("ничего не рендерит, пока данные ещё не загрузились", () => {
        const { container } = render(<VideoList data={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });
});
