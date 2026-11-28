import { describe, expect, it } from "vitest";

import { parseCatalogView, withCatalogView } from "../catalogView";

describe("вкладка каталога на телефоне в адресе", () => {
    it("по умолчанию — список, карта только по ?view=map", () => {
        expect(parseCatalogView(undefined)).toBe("list");
        expect(parseCatalogView("map")).toBe("map");
        expect(parseCatalogView("list")).toBe("list");
        expect(parseCatalogView(["map", "list"])).toBe("list");
        expect(parseCatalogView("что-то")).toBe("list");
    });

    it("фильтры в адресе сохраняются, список — без параметра", () => {
        expect(withCatalogView("?category=1,2&page=3", "map")).toBe("?category=1%2C2&page=3&view=map");
        expect(withCatalogView("?category=1&view=map", "list")).toBe("?category=1");
        expect(withCatalogView("?view=map", "list")).toBe("");
        expect(withCatalogView("", "map")).toBe("?view=map");
        expect(withCatalogView("search=зима", "map")).toBe(`?search=${encodeURIComponent("зима").replace(/%20/g, "+")}&view=map`);
    });
});
