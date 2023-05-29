import { YMapType } from "components/Ymaps/types/ymaps";

export default async function validateCoordinates(
  ymap: YMapType,
  address: string,
  minimumLength: number = 3,
) {
  if (address?.length > minimumLength) {
    address = address.trim();
    if (isNaN(+address[0])) {
      return address;
    }
    try {
      const res = await ymap?.geocode(address);
      const firstGeoObject = res.geoObjects.get(0);
      return firstGeoObject.getThoroughfare();
    } catch (e) {
      console.log(e);
    }
  }
}
