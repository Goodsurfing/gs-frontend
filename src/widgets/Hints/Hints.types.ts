import { GeoObjectHintType } from "../../components/Ymaps/types/ymaps";

export interface IHintsProps {
    hints: GeoObjectHintType[];
    setAddress: (value: string) => void;
    setAddressByHint: (value: boolean) => void;
    selectedAddressByHint: boolean;
}
