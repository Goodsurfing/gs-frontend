import { YMapType } from 'components/Ymaps/types/ymaps';

export default async function validateCoordinates(
  ymap: YMapType,
  address: string,
  minimumLength: number = 3,
) {
  if (address?.length > minimumLength) {
    const normalAddress = address.trim();
    if (Number.isNaN(+normalAddress[0])) {
      return normalAddress;
    }
    try {
      const res = await ymap?.geocode(address);
      const firstGeoObject = res.geoObjects.get(0);
      return firstGeoObject.getThoroughfare();
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return null;
}
