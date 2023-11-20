import { Offer } from "@/entities/Offer";
import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

export const mockedOfferData: Offer = {
    when: {
        durationMinDays: 26,
        durationMaxDays: 30,
        isApplicableAtTheEnd: true,
        isFullYearAcceptable: true,
        isWithoutApplicationEndDate: true,
        periods: [{ start: "31.01.2023", end: "8.02.2023" }],
    },
    where: {
        address: "Казань",
    },
    conditions: {
        extraFeatures: ["additional", "excursions"],
        facilities: ["bath", "wi-fi"],
        payment: { currency: "RUB", contribution: 1600, reward: 2000 },
        extraConditions: "some conditions",
        housing: "bed",
        nutrition: "full",
        travel: "reimbursement",
    },
    whatToDo: {
        skills: [{ id: 1, text: "cooking" }, { id: 2, text: "farming" }, { id: 3, text: "driving" }],
        workingHours: { dayOff: 3, hours: 40, timeType: "day" },
        additionalSkills: ["additional skills"],
        extraInfo: "extra info",
    },
    whoNeeds: {
        gender: "man",
        languages: ["russian", "english"],
        receptionPlace: "foreigners",
        volunteerPlaces: 3,
        additionalInfo: "additional info",
        age: "20",
    },
    description: {
        title: "Природный парк «Вулканы Камчатки» ждет волонтеров!",
        longDescription:
            "В летнем сезоне 2023 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. Ждем волонтеров на новый летний сезон! Природный парк «Вулканы Камчатки» объявляет о начале приема заявок на участие в волонтерской программе 2020 года от потенциальных кандидатов. Добровольцы смогут отправиться в природные парки «Налычево», «Быстринский» и «Ключевской». Работы, к которым будут привлекаться волонтеры, запланированы на период с июня по сентябрь. В летнем сезоне 2020 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. В частности, планируется задействовать волонтеров в работах, связанных с ремонтом и поддержанием в надлежащем виде объектов туристической инфраструктуры, благоустройством прилегающей территории, уборкой мусора, ведением экскурсионной деятельности и общением с посетителями ООПТ регионального значения.",
        shortDescription: "short description",
        category: ["category1", "category2"],
        images: [defaultImage, defaultImage, defaultImage],
        organization: { name: "КГБУ «Природный парк «Вулканы Камчатки»", description: "Природный парк «Вулканы Камчатки» — особо охраняемая природная территория на Камчатке, самая большая по размеру в Камчатском крае (2,475 млн га)." },
    },
    finishingTouches: {
        faq: "some faq",
        rulesInfo: "some rules",
        welcomeMessage: "welcome message",
        extraConditions: ["students", "adult-only", "allow-kids", "couples"],
    },
};
