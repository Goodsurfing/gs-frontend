import { GeoObjectHintType } from "../Ymaps/types/ymaps";

export interface IHintsProps {
    hints: GeoObjectHintType[];
    setAddress: (value: string) => void;
    setAddressByHint: (value: boolean) => void;
    selectedAddressByHint: boolean;
}
