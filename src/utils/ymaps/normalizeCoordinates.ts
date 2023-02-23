import { YMapType } from "@/components/Ymaps/types/ymaps";

export default async function validateCoordinates(ymap: YMapType, address: string) {
    address = address.trim();
    if (isNaN(+address[0])) {
        return address;
    }
    const res = await ymap?.geocode(address);
    const firstGeoObject = res.geoObjects.get(0);
    return firstGeoObject.getThoroughfare();
}