import { GetDonation, GetDonations } from "../model/types/donationSchema";
import mockImgSrc from "@/shared/assets/images/default-offer-image.png";

const mockImg = { id: "mock", contentUrl: mockImgSrc } as any;

export const mockCardDonations: GetDonations[] = [
    {
        id: "1",
        name: "Тестовый сбор 1",
        shortDescription: "Тут находится описани у сбора",
        image: mockImg,
        daysLeft: 0,
        percentAmountCollect: 50,
        organization: {
            name: "Тестовая организация",
        },
        isCanEdit: true,
        isClose: false,
        isSuccess: false,
    },
    {
        id: "1",
        name: "Тестовый сбор 1",
        shortDescription: "Тут находится описани у сбора",
        image: mockImg,
        daysLeft: 0,
        percentAmountCollect: 50,
        organization: {
            name: "Тестовая организация",
        },
        isCanEdit: true,
        isClose: false,
        isSuccess: true,
    },
    {
        id: "1",
        name: "Тестовый сбор 1",
        shortDescription: "Тут находится описани у сбора",
        image: mockImg,
        daysLeft: 0,
        percentAmountCollect: 50,
        organization: {
            name: "Тестовая организация",
        },
        isCanEdit: true,
        isClose: false,
        isSuccess: true,
    },
    {
        id: "1",
        name: "Тестовый сбор 1",
        shortDescription: "Тут находится описани у сбора",
        image: mockImg,
        daysLeft: 0,
        percentAmountCollect: 50,
        organization: {
            name: "Тестовая организация",
        },
        isCanEdit: true,
        isClose: false,
        isSuccess: true,
    },
    {
        id: "1",
        name: "Тестовый сбор 1",
        shortDescription: "Тут находится описани у сбора",
        image: mockImg,
        daysLeft: 0,
        percentAmountCollect: 50,
        organization: {
            name: "Тестовая организация",
        },
        isCanEdit: true,
        isClose: false,
        isSuccess: true,
    },
];

export const mockDonation: GetDonation = {
    id: "1",
    image: mockImg,
    name: "Тестовый сбор 1",
    description: "Полное описание",
    address: "Москва, Россия",
    amount: 1500,
    minAmount: 1000,
    categories: [],
    galleryImages: [],
    status: "active",
    isCanEdit: true,
    isCanSupport: false,
    isSuccess: true,
    latitude: 50,
    longitude: 50,
    daysLeft: 3,
    peopleSupportCount: 50,
    percentAmountCollect: 43,
    startDate: "4.04.2026",
    organization: {
        id: "1",
        name: "Тестовая организация",
        image: mockImg,
        description: "Тут находится описание организации",
    },
};

export const mockRatingDonation = [
    {
        id: "1",
        name: "Мария Иванова",
        numberDonations: 57,
        totalAmountDonations: 3000,
    },
    {
        id: "1",
        name: "Мария Иванова",
        numberDonations: 57,
        totalAmountDonations: 3000,
    },
    {
        id: "1",
        name: "Мария Иванова",
        numberDonations: 57,
        totalAmountDonations: 3000,
    },
    {
        id: "1",
        name: "Мария Иванова",
        numberDonations: 57,
        totalAmountDonations: 3000,
    },
    {
        id: "1",
        name: "Мария Иванова",
        numberDonations: 57,
        totalAmountDonations: 3000,
    },
];

export const mockHostDonation = [
    {
        id: "1",
        author: "Мария Иванова",
        nameDonation: "Тестовый сбор",
        totalAmountDonations: 3000,
        date: "24.08.2026",
    },
    {
        id: "1",
        author: "Мария Иванова",
        nameDonation: "Тестовый сбор",
        totalAmountDonations: 3000,
        date: "24.08.2026",
    },
    {
        id: "1",
        author: "Мария Иванова",
        nameDonation: "Тестовый сбор",
        totalAmountDonations: 3000,
        date: "24.08.2026",
    },
    {
        id: "1",
        author: "Мария Иванова",
        nameDonation: "Тестовый сбор",
        totalAmountDonations: 3000,
        date: "24.08.2026",
    },

];
