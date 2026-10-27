import { describe, expect, it } from "vitest";

import { getAttachmentName } from "./getAttachmentName";

describe("getAttachmentName", () => {
    it("показывает исходное имя файла, если оно есть", () => {
        expect(getAttachmentName({
            contentUrl: "https://s3/media/6720f-abc123.pdf",
            name: "Программа курса.pdf",
        })).toBe("Программа курса.pdf");
    });

    it("для старых файлов берёт имя из адреса", () => {
        expect(getAttachmentName({ contentUrl: "https://s3/media/6720f-abc123.pdf", name: null }))
            .toBe("6720f-abc123.pdf");
    });

    it("раскодирует закодированное имя из адреса", () => {
        expect(getAttachmentName({ contentUrl: "https://s3/media/%D0%BF%D0%BB%D0%B0%D0%BD.pdf" }))
            .toBe("план.pdf");
    });

    it("возвращает заглушку для пустого адреса", () => {
        expect(getAttachmentName({ contentUrl: "https://s3/media/" })).toBe("Файл");
    });
});
