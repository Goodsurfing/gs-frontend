import { Message, UserChatType, UserType } from "../types/messenger";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";

export const mockedUsers: UserType[] = [
    {
        id: "1",
        avatar: defaultImage,
        name: "Николай Николаев",
        date: "14.08.2024",
        lastMessage: "Есть какие-то необычные вещи, которые всегда берешь с собой?",
        newMessages: 0,
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

export const mockedChatUser: UserChatType = {
    id: "1",
    name: "Александр Смирнов",
    address: "Россия, Москва",
    avatar: defaultImage,
    arrivalDate: new Date(),
    expirationDate: new Date(),
    cases: ["Природный парк \"Вулканы Камчатки\" ждет волонтеров!", "Итуруп-жемчужина Курил!", "Студенческий Экологический Отряд «Новая Земля»"],
    description: "Волонтёр, 27 лет",
    languages: [{ language: "russian", level: "B2" }, { language: "russian", level: "B2" }],
    skills: ["art", "admin", "sport"],
};

export const mockedMessages: Message[] = [
    {
        date: new Date(),
        content: "Привет!",
    },
];
