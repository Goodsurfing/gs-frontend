export type WhatToDoSkillType =
| "admin" | "cooking" | "driving" | "housing" | "decor"
| "tourism" | "art" | "farming" | "social" | "recording" | "gardening"
| "music" | "photo" | "night_job" | "sport";

export interface Skill {
    id: number;
    name: string;
    imagePath: string;
}

export interface SkillsField {
    skills: Skill[];
}
