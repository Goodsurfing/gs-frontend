import { Profile, ProfileById } from "@/entities/Profile";
import { ChatType } from "@/entities/Messenger";

export function getEffectiveCompanion(
    companionData: ProfileById | undefined,
    chatData: ChatType | undefined,
): ProfileById | Profile | undefined {
    return companionData ?? chatData?.otherParticipants?.[0];
}
