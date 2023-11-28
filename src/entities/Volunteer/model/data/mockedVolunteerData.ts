import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { Volunteer } from "../types/volunteer";
import { mockedReview } from "@/entities/Host/model/data/mockedHostData";
import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

export const mockedVolunteerData: Volunteer = {
    id: "1",
    imageUuid: defaultImage,
    firstName: "Станислав",
    lastName: "Старовойтов",
    aboutMe: "about me",
    isMember: true,
    birthDate: "23-04-1994",
    certificates: [""],
    skills: [{ id: "cooking", icon: "", text: "Готовка" }],
    email: "example@gmail.com",
    locale: "ru",
    articles: mockedArticlesData,
    reviews: mockedReview,
};
