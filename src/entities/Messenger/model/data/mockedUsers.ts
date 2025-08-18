import { MessageTypeMocked, UserChatType } from "../types/messenger";
import defaultImage from "@/shared/assets/images/default-offer-image.png";

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
    messages: [
        {
            isUser: false, content: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", date: new Date(),
        }, {
            isUser: true, content: "Привет, как сам?", date: new Date(),
        },
    ],
};

export const mockedMessages: MessageTypeMocked[] = [
    {
        date: new Date(),
        content: "Привет!",
        isUser: false,
    },
];
