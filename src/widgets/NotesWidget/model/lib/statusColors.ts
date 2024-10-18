import { FormApplicationStatus } from "@/entities/Application";

export const statusColors: Record<FormApplicationStatus, string> = {
    new: "#79C8FF",
    accepted: "#77EB98",
    canceled: "#FCC3C3",
};
