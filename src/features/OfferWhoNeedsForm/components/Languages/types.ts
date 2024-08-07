import { ReactNode } from "react";
import { Language } from "@/entities/Offer/model/types/offerWhoNeeds";

export interface LanguagesProps {
    close?: ReactNode;
    value: Language;
    selectedLanguages: Language[];
    onChange: (value: Language) => void;
}
