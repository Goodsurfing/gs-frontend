import ymaps from "yandex-maps";

export type FeatureMember = {
    GeoObject: GeoObject;
};

export type Point = { pos: string };

export interface GeoObject {
    Point: Point;
    description: string;
    name: string;
}

export interface GeocoderResponseMetaData {
    request: string;
    results: string;
    found: string;
}

export interface GeoObjectCollection {
    featureMember: FeatureMember[] | [];
    GeocoderResponseMetaData: GeocoderResponseMetaData;
}

export type YmapType = ymaps.Map | typeof ymaps;

export type YmapQueryType = {
    ns: string;
    load: string;
};

export type MapDefaultState = {
    center?: [number, number];
    zoom?: number;
};
