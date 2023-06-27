import axios from "axios";
import { YmapType } from "@/entities/Map";

export async function findCoordinates(ymap: YmapType, address: string) {
    address = address.trim();
    if (address.length > 3) {
        return null;
    }
    try {
        const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.REACT_APP_API_YANDEX_KEY}&format=json&geocode=${address}`);
        console.log(res.data);
    } catch (e) {
        console.log(e);
    }
    return null;
}
