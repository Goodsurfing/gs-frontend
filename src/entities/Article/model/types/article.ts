export interface Article {
    id: string;
    image: string;
    title: string;
    tag: string;
    date: string;
    description: string;
    likes: number;
    comments: number;
}

export interface Journal {
    id: string;
    image: string;
    title: string;
    date: string;
    description: string;
    likes: number;
    comments: number;
}

export interface Video {
    id: string;
    url: string;
    title: string;
    date: string;
    likes: number;
    tag: string;
    comments: number;
}
