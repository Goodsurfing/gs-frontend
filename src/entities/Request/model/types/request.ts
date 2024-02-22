import { Profile } from "@/entities/Profile";

export type NotificationType = "new" | "seen" | "done";

export interface Request {
    user: Profile;
    notificationType: NotificationType;
    article: string;
}
