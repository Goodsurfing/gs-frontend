import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import { TeamUser } from "../types/team";

export const fakeUserData: TeamUser[] = [
    {
        id: 1,
        name: "Владислав",
        surname: "Краснопольский",
        avatar: defaultAvatarImage,
        email: "example@gmail.com",
        city: "Казань",
        country: "Россия",
        role: "Организатор",
    },
    {
        id: 2,
        name: "Владислав",
        surname: "Краснопольский",
        email: "test@gmail.com",
        avatar: "",
        city: "Казань",
        country: "Россия",
        role: "Участник",
    },
    {
        id: 3,
        name: "Владислав",
        surname: "Краснопольский",
        email: "test1@gmail.com",
        avatar: "",
        city: "Казань",
        country: "Россия",
        role: "Участник",
    },
    {
        id: 4,
        name: "Владислав",
        surname: "Краснопольский",
        avatar: defaultAvatarImage,
        email: "example@gmail.com",
        city: "Казань",
        country: "Россия",
        role: "Организатор",
    },
    {
        id: 5,
        name: "Владислав",
        surname: "Краснопольский",
        avatar: defaultAvatarImage,
        email: "example@gmail.com",
        city: "Казань",
        country: "Россия",
        role: "Организатор",
    },
];
