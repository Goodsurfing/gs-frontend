const allLanguages = {
    english: "english",
    russian: "russian",
    german: "german",
    spanish: "spanish",
};

const allLevels = {
    A1: "A1",
    A2: "A2",
    B1: "B1",
    B2: "B2",
    C1: "C1",
    C2: "C2",
};

export type AllLanguages = keyof typeof allLanguages;

export type AllLevels = keyof typeof allLevels;

export interface Language {
    language: AllLanguages;
    level: AllLevels;
}
