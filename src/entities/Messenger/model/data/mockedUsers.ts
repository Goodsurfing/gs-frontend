import { UserType } from "../types/messenger";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";

export const mockedUsers: UserType[] = [
    {
        id: "1",
        avatar: defaultImage,
        name: "Николай Николаев",
        date: "14.08.2024",
        lastMessage: "Есть какие-то необычные вещи, которые всегда берешь с собой?",
        newMessages: 3,
        state: "new",
    },
    {
        id: "2",
        avatar: null,
        name: "Николай Николаев",
        date: "14.08.2024",
        lastMessage: "Есть какие-то необычные вещи, которые всегда берешь с собой?",
        newMessages: 3,
        state: "new",
    },
    {
        id: "3",
        avatar: defaultImage,
        name: "Николай Николаев",
        date: "14.08.2024",
        lastMessage: "Есть какие-то необычные вещи, которые всегда берешь с собой?",
        newMessages: 3,
        state: "new",
    },
];
