import type { components } from "@goodsurfing/api";

export type Occupancy = components["schemas"]["OccupancyResult"];

/** Членство организатора (hasHostMembership старого фронта): хостовое, иначе общее */
export const hasHostMembership = (occupancy: Occupancy): boolean => occupancy.isHostMembership ?? occupancy.isMembership ?? false;
