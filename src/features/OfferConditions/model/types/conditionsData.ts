import {
    Housing, Nutrition, Travel, Facilities, ExtraFeatures,
} from "@/entities/Offer";

export type ConditionIds = Housing | Nutrition | Travel | Facilities | ExtraFeatures;

export interface ConditionItems {
    text: string;
    icon: string;
    id: ConditionIds;
}

export interface LiveItems extends ConditionItems {
    id: Housing;
}

export interface FoodItems extends ConditionItems {
    id: Nutrition;
}

export interface PayedRideItems extends ConditionItems {
    id: Travel;
}

export interface GoodsItems extends ConditionItems {
    id: Facilities;
}

export interface ExtraAvailiablesItems extends ConditionItems {
    id: ExtraFeatures;
}
