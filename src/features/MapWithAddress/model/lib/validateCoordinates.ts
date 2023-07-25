import { ymapsDefaultLocation } from "@/shared/constants/ymaps";

export const validateCoordinates = (location: string | undefined): [number, number] => {
    if (!location) {
        return ymapsDefaultLocation;
    }
    const newLocation = location.split(" ");
    if (newLocation.length === 2) {
        const latitude = Number(newLocation[0]);
        const longtitude = Number(newLocation[1]);
        if (!Number.isNaN(latitude) && !Number.isNaN(longtitude)) {
            return [longtitude, latitude];
        }
    }
    return ymapsDefaultLocation;
};
