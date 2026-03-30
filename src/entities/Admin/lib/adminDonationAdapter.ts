import { getFullName } from "@/shared/lib/getFullName";
import { GetAdminDonations } from "../model/types/adminDonationSchema";

export const adminDonationsAdapter = (data: GetAdminDonations[]) => data.map((donation) => {
    const {
        id, name, firstName, lastName,
        amount, category, endDate,
        minAmount, moneyRaised,
        peopleSupportCount, percentAmountCollect,
        status,
    } = donation;

    return {
        id,
        name,
        author: getFullName(firstName, lastName),
        category,
        isActive: status !== "draft",
        amount,
        minAmount,
        peopleSupportCount,
        percentAmountCollect,
        moneyRaised,
        endDate,
    };
});
