import { YMapType } from "@/components/Ymaps/types/ymaps";

export default async function getGeocodeByName(ymap: YMapType, address: string) {
    if (!ymap) {
        return false;
    }
    return ymap.geocode(`${address}`);
}
