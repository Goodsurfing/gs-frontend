import { fakeUserData } from "@/entities/User/model/data/mockedUserData";
import { FullHost, Host } from "../types/host";
import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

export const mockedHostData: Host = {
    id: "1",
    name: "КГБУ «Природный парк «Вулканы Камчатки»",
    description: "Природный парк «Вулканы Камчатки» — особо охраняемая природная территория на Камчатке, самая большая по размеру в Камчатском крае (2,475 млн га",
    address: "Камчатка, Россия",
    type: "ООПТ",
    facebook: "",
    instagram: "",
    telegram: "",
    vk: "",
    website: "",
};

export const mockedFullHostData: FullHost = {
    host: mockedHostData,
    team: fakeUserData,
    articles: mockedArticlesData,
    offers: mockedOffersData,

};
