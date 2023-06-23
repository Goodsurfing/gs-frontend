import { YmapType } from "@/entities/Map";

export async function findCoordinates(ymap: YmapType, address: string) {
    address = address.trim();
    try {
        const res = await ymap.geocode(address);
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject.geometry?._coordinates) {
            return firstGeoObject.geometry._coordinates;
        }
        return null;
    } catch (e) {
        console.log(e);
    }
}
