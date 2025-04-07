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
    review: Review[]
}

export interface Course {
    id: number;
    cover: string;
    title: string;
    description: string;
    aboutAuthor: string;
    numberLessons: number;
    progress: number;
    duration: string;
    rating: number;
    author: string;
    experts: Exptert[];
    lessons: Lesson[];
    review: Review[];
}
