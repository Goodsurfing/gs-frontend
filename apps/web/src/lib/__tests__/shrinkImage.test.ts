import { describe, expect, it } from "vitest";

import { fitSize } from "../shrinkImage";

describe("уменьшение фото перед загрузкой", () => {
    it("вписывает в 1024 по большей стороне с сохранением пропорций", () => {
        expect(fitSize(4032, 3024)).toEqual({ width: 1024, height: 768 });
        expect(fitSize(3024, 4032)).toEqual({ width: 768, height: 1024 });
    });
    it("маленькое не увеличивает", () => {
        expect(fitSize(800, 600)).toEqual({ width: 800, height: 600 });
    });
});
