import { describe, expect, it } from "vitest";
import { getGeoObjectByCoordinates } from "./getGeoObjectCollection";

describe("getGeoObjectByCoordinates", () => {
    it("returns undefined without throwing when longitude is null", async () => {
        await expect(getGeoObjectByCoordinates(null as unknown as number, 55.75))
            .resolves.toBeUndefined();
    });

    it("returns undefined without throwing when latitude is undefined", async () => {
        await expect(getGeoObjectByCoordinates(37.61, undefined as unknown as number))
            .resolves.toBeUndefined();
    });

    it("returns undefined without throwing when both coordinates are missing", async () => {
        await expect(getGeoObjectByCoordinates(
            null as unknown as number,
            null as unknown as number,
        )).resolves.toBeUndefined();
    });
});
