import { Profile } from "../types/profile";

export const mockedProfileData: Profile[] = [
    {
        id: "1",
        email: "test@mail.ru",
        favoriteCategories: ["animals", "art"],
        galleryImages: [],
        locale: "ru",
        memberProfiles: [{ id: 1, organization: "ogranization 1" }],
        membershipEndDate: "memberShipDate",
        firstName: "Alexander",
        lastName: "Chebatkov",
        phone: "phone",
        gender: "female",
    },
];
