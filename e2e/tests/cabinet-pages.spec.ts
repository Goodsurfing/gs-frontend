import { test } from '@playwright/test';
import { expectPageWorks } from '../support/pageCheck';

/**
 * GS-214: все страницы кабинета открываются у вошедшего пользователя без
 * ошибок и не выкидывают на вход. Волонтёр — vol@test.com, хост —
 * host@test.com (сессии из global-setup).
 */
const COMMON = [
    '/profile/info',
    '/profile/preferences',
    '/profile/role',
    '/profile/reset-password',
    '/profile/privacy',
    '/messenger',
    '/favorite-offers',
    '/membership',
];

const VOLUNTEER = [
    '/volunteer/volunteer-dashboard',
    '/volunteer/skills',
    '/volunteer/review',
    '/volunteer/notes',
    '/volunteer/donations',
    '/volunteer/subscribers',
    '/volunteer/gallery',
    '/volunteer/articles',
];

const HOST = [
    '/host/host-dashboard',
    '/host/info',
    '/host/gallery',
    '/host/video',
    '/host/team',
    '/host/review',
    '/host/notes',
    '/host/my-offers',
    '/host/donations',
    '/host/donation-rating',
    '/offers/welcome',
    '/fundraise/welcome',
];

test.describe('Кабинет — волонтёр', () => {
    test.use({ storageState: 'e2e/.auth/vol.json' });

    for (const path of [...COMMON, ...VOLUNTEER]) {
        test(path, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
            await expectPageWorks(page, `${path}`);
        });
    }
});

test.describe('Кабинет — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    for (const path of [...COMMON, ...HOST]) {
        test(path, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'host', 'один раз на прогон');
            await expectPageWorks(page, `${path}`);
        });
    }
});

test.describe('Кабинет — гость', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('личные страницы уводят на вход', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        for (const path of ['/profile/info', '/host/host-dashboard', '/messenger']) {
            await page.goto(`${path}`);
            await page.waitForURL(/\/signin/, { timeout: 15_000 });
        }
    });
});
