import { YMapsApi } from 'react-yandex-maps';
import { LocationType } from 'constants/ymaps';

export type YMapType = YMapsApi | null;

export interface IYandexMap {
    defaultLocation: LocationType;
    location: LocationType | undefined;
    zoom: number;
    ymap: YMapType;
    setYmap: (ymap: YMapType) => void;
    className?: string;
    width?: string;
    height?: string;
    modules?: Array<string>;
}

export type GeoObjectHintType = {
    GeoObject: {
        Point: { pos: Array<string> };
        description: string;
        name: string;
    };
};
