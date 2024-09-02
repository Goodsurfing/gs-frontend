import { ReactNode } from "react";
import { Language } from "@/types/languages";

export interface LanguagesProps {
    close?: ReactNode;
    value: Language;
    selectedLanguages: Language[];
    onChange: (value: Language) => void;
}
