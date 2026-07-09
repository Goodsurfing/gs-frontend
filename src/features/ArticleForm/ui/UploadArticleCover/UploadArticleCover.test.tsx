import {
    describe, it, expect, vi,
} from "vitest";
import {
    render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import { UploadArticleCover } from "./UploadArticleCover";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

let resolveUpload: (value: unknown) => void;
vi.mock("@/shared/hooks/files/useUploadFile", () => ({
    default: vi.fn(() => new Promise((resolve) => {
        resolveUpload = resolve;
    })),
}));

/**
 * Регресс-guard для row 61: загрузка обложки статьи не показывала никакой
 * индикации в процессе запроса — выглядело так, будто клик "не сработал".
 */
describe("UploadArticleCover — индикация загрузки", () => {
    it("показывает лоадер, пока идёт загрузка обложки, и скрывает после завершения", async () => {
        const onUpload = vi.fn();
        const { container } = render(<UploadArticleCover id="cover" onUpload={onUpload} />);

        const input = container.querySelector("input[type=file]") as HTMLInputElement;
        const file = new File(["content"], "cover.png", { type: "image/png" });

        fireEvent.change(input, { target: { files: [file] } });

        expect(await screen.findByRole("progressbar")).toBeInTheDocument();

        resolveUpload({ id: "1", contentUrl: "url", thumbnails: {} });

        await waitFor(() => {
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });
        expect(onUpload).toHaveBeenCalled();
    });
});
