import { Review } from "@/entities/Review";

export interface Exptert {
    image: string;
    name: string;
    description: string;
    address: string;
}

export interface Lesson {
    id: number;
    thumbnail: string;
    title: string;
    description: string;
    duration: string;
    rating: number;
    reviews: Review[]
}

export interface Course {
    id: number;
    cover?: string;
    title: string;
    description?: string;
    author: string;
    aboutAuthor?: string;
    forWho?: string;
    experts: Exptert[];
    lessons: Lesson[];
    numberLessons: number;
    progress: number;
    duration: string;
    rating: number;
    reviews: Review[];
}
