import { request } from '@playwright/test';
import { API_URL } from '../config';

/**
 * Публичные страницы сайта — общий список для функциональных проверок
 * (public-pages.spec.ts) и визуальных эталонов (visual/). Адреса страниц
 * с данными берутся из API стенда, чтобы тесты шли на живых записях.
 */
export interface PublicPage {
    name: string;
    /** Путь без языкового префикса */
    path: string;
}

export const STATIC_PAGES: PublicPage[] = [
    { name: 'main', path: '' },
    { name: 'offers-map', path: '/offers-map' },
    { name: 'categories', path: '/categories' },
    { name: 'membership', path: '/membership' },
    { name: 'npo', path: '/npo' },
    { name: 'rules', path: '/rules' },
    { name: 'about-project', path: '/about-project' },
    { name: 'find-job', path: '/find-job' },
    { name: 'become-host', path: '/become-host' },
    { name: 'blog', path: '/blog' },
    { name: 'news', path: '/news' },
    { name: 'journals', path: '/journals' },
    { name: 'video', path: '/video' },
    { name: 'privacy-policy', path: '/privacy-policy' },
    { name: 'payment-security-policy', path: '/payment-security-policy' },
    { name: 'our-team', path: '/our-team' },
    { name: 'ambassadors', path: '/ambassadors' },
    { name: 'academy-main', path: '/academy-main' },
    { name: 'donation-map', path: '/donation-map' },
    { name: 'donation-reports', path: '/donation-reports' },
    { name: 'donation-rating', path: '/donation-rating' },
    { name: 'signin', path: '/signin' },
    { name: 'signup', path: '/signup' },
];

type ListItem = { id?: string | number; slug?: string | null; organization?: { id?: string } };

const firstItem = async (endpoint: string): Promise<ListItem | undefined> => {
    const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
    try {
        const res = await api.get(`/api/v1/${endpoint}${endpoint.includes('?') ? '&' : '?'}page=1&limit=1`);
        if (!res.ok()) return undefined;
        const body = await res.json();
        const list = Array.isArray(body) ? body : body?.data;
        return Array.isArray(list) ? list[0] : undefined;
    } finally {
        await api.dispose();
    }
};

/** Страницы с данными: вакансия, организация, статьи, видео, курс, сбор. */
export const loadDataPages = async (): Promise<PublicPage[]> => {
    const [vacancy, blog, news, journal, video, course, fundraise] = await Promise.all([
        firstItem('vacancy'),
        firstItem('blog'),
        firstItem('news'),
        firstItem('journal'),
        firstItem('video'),
        firstItem('course'),
        firstItem('fundraise'),
    ]);
    const pages: PublicPage[] = [];
    if (vacancy?.id) pages.push({ name: 'vacancy', path: `/offers/${vacancy.id}` });
    if (vacancy?.organization?.id) pages.push({ name: 'organization', path: `/organizations/${vacancy.organization.id}` });
    if (blog) pages.push({ name: 'blog-article', path: `/blog/${blog.slug ?? blog.id}` });
    if (news) pages.push({ name: 'news-article', path: `/news/${news.slug ?? news.id}` });
    if (journal) pages.push({ name: 'journal', path: `/journals/${journal.slug ?? journal.id}` });
    if (video?.id) pages.push({ name: 'video-item', path: `/video/${video.id}` });
    if (course?.id) pages.push({ name: 'course', path: `/academy-course/${course.id}` });
    if (fundraise?.id) pages.push({ name: 'fundraise', path: `/fundraise/${fundraise.id}` });
    return pages;
};
