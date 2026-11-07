import { expect, request, test } from '@playwright/test';
import { API_URL, BASE_URL } from '../config';
import { MAILPIT_URL, waitForEmail } from '../support/mailpit';
import { authHeaders, createSession, E2eSession } from '../support/session';
import { payWithTestCard, replayPaymentSucceeded } from '../support/yookassa';
import { pause, say, scrollTo, shot, startScene, titleCard } from './support/demo';

/**
 * Демо «Членство на двоих»: админ включает тариф, Анна оплачивает его тестовой
 * картой ЮKassa и приглашает Бориса письмом, Борис входит по ссылке и
 * присоединяется, у обоих членство. Только стейдж: оплата — тестовый магазин.
 */
const FEATURE = 'membership-duo';

const setName = async (session: E2eSession, firstName: string, lastName: string) => {
    const api = await request.newContext({ baseURL: API_URL });
    const res = await api.patch('/api/v1/profile', { data: { firstName, lastName, locale: 'ru' }, headers: authHeaders(session) });
    expect(res.ok(), await res.text()).toBeTruthy();
    await api.dispose();
};

interface TariffRow { code: string; active: boolean; priceRub: number }

const duoTariff = async (admin: E2eSession): Promise<TariffRow> => {
    const api = await request.newContext({ baseURL: API_URL });
    const res = await api.get('/admin/v1/membership/tariffs/settings', { headers: authHeaders(admin) });
    expect(res.ok(), await res.text()).toBeTruthy();
    const body = await res.json();
    const rows: TariffRow[] = Array.isArray(body) ? body : (body.data ?? body.items ?? []);
    await api.dispose();
    const row = rows.find((r) => r.code === 'volunteer_duo');
    expect(row, 'нет тарифа volunteer_duo').toBeTruthy();
    return row as TariffRow;
};

/** Скрыть тариф до записи — чтобы в видео было видно, как его включают */
const setDuoActive = async (admin: E2eSession, active: boolean) => {
    const api = await request.newContext({ baseURL: API_URL });
    const res = await api.patch('/admin/v1/membership/tariffs/volunteer_duo', { data: { active }, headers: authHeaders(admin) });
    expect(res.ok(), await res.text()).toBeTruthy();
    await api.dispose();
};

/** Страница «Членство» кешируется на 5 минут — ждём, пока на ней появится блок «на двоих» */
const waitForOfferOnSite = async () => {
    const deadline = Date.now() + 7 * 60_000;
    while (Date.now() < deadline) {
        const html = await (await fetch(`${BASE_URL}/membership`, { headers: { Cookie: 'gs_web=1' } })).text();
        if (html.includes('Едете вдвоём?')) return;
        await pause(15_000);
    }
    throw new Error('блок «Едете вдвоём?» не появился на странице «Членство» за 7 минут');
};

test('Демо: членство на двоих', async ({ browser }) => {
    test.setTimeout(20 * 60_000);
    const stamp = Date.now();

    const admin = await createSession(`demo-duo-admin-${stamp}`, { admin: true });
    const anna = await createSession(`demo-duo-anna-${stamp}`, { volunteer: true });
    const boris = await createSession(`demo-duo-boris-${stamp}`, { volunteer: true });
    await setName(anna, 'Анна', 'Смирнова');
    await setName(boris, 'Борис', 'Петров');
    await setDuoActive(admin, false);

    // Сцена 1. Админка: тариф включается и цена меняется здесь же
    {
        const { page, finish } = await startScene(browser, FEATURE, 1, { session: admin });
        await titleCard(page, 'Членство на двоих', 'Один человек оплачивает членство за двоих, второй присоединяется по ссылке-приглашению. У обоих — все возможности членства на год.', 4500);
        await page.goto('/admin/tariffs');
        const row = page.locator('div.rounded-\\[8px\\]').filter({ hasText: 'volunteer_duo' });
        await expect(row).toBeVisible({ timeout: 30_000 });
        await row.scrollIntoViewIfNeeded();
        await say(page, 'Админка → «Тарифы членства». Тариф «на двоих» после релиза заведён выключенным.', 4000);
        await say(page, 'Здесь же меняется цена — сейчас 1 490 ₽. Сайт подхватывает новую цену в течение 5 минут.', 4000);
        const show = row.getByRole('button', { name: 'Показать на сайте' });
        if (await show.isVisible()) {
            await say(page, 'Чтобы тариф появился на сайте, нажимаем «Показать на сайте».', 3000);
            await show.click();
            await expect(row.getByRole('button', { name: 'Скрыть с сайта' })).toBeVisible();
        } else {
            await say(page, 'Тариф уже включён — кнопка «Скрыть с сайта» уберёт его со страницы «Членство».', 3500);
        }
        await shot(page, FEATURE, '01-admin-tariff');
        await say(page, 'Готово: на странице «Членство» появляется блок «Едете вдвоём?».', 3500);
        await finish();
    }

    expect((await duoTariff(admin)).active).toBe(true);
    await waitForOfferOnSite();

    // Сцена 2. Анна оплачивает «на двоих» и отправляет приглашение
    {
        const { page, finish } = await startScene(browser, FEATURE, 2, { session: anna });
        await titleCard(page, 'Анна оформляет членство на двоих', 'Волонтёр, вошла на сайт, членства пока нет', 3000);
        await page.goto('/membership');
        await say(page, 'Страница «Членство». Под обычными тарифами волонтёра — новый блок.', 3000);
        await scrollTo(page, 'text=Едете вдвоём?');
        await say(page, 'Цена за двоих и сколько выходит с человека. Нажимаем «Оформить на двоих».', 4000);
        await shot(page, FEATURE, '02-offer');
        await page.getByRole('link', { name: 'Оформить на двоих' }).click();

        await page.waitForURL(/yoomoney\.ru\/checkout/, { timeout: 30_000 });
        await pause(1500);
        await say(page, 'Обычная оплата в ЮKassa. На стейдже — тестовая карта, деньги не списываются.', 3500);
        await shot(page, FEATURE, '03-yookassa');
        const orderId = await payWithTestCard(page);

        // Тестовый магазин шлёт уведомление не на стейдж — повторяем его сами
        const api = await request.newContext({ baseURL: API_URL });
        await replayPaymentSucceeded(api, orderId);
        await api.dispose();

        if (/yoomoney\.ru/.test(page.url())) {
            const back = page.getByRole('button', { name: 'Вернуться на сайт' });
            await expect(back).toBeVisible({ timeout: 30_000 });
            await say(page, 'ЮKassa подтвердила оплату. Возвращаемся на сайт.', 3000);
            await back.click();
        }
        await page.waitForURL(/goodsurfing\.org\/(en\/|es\/)?payment\/success/, { timeout: 60_000 });
        await expect(page.getByRole('heading', { name: 'Членство на двоих' })).toBeVisible({ timeout: 60_000 });
        await say(page, 'Оплата прошла. Сразу на странице успеха — ссылка для второго участника.', 4000);
        await scrollTo(page, '#duo-invite-url');
        await say(page, 'Ссылку можно скопировать и переслать в любой мессенджер — или отправить письмом.', 4000);
        await shot(page, FEATURE, '04-success-invite');

        await page.getByLabel('Или отправим приглашение на почту').pressSequentially(boris.email, { delay: 30 });
        await page.getByRole('button', { name: 'Отправить', exact: true }).click();
        await expect(page.getByText(`Приглашение отправлено на ${boris.email}`)).toBeVisible({ timeout: 20_000 });
        await say(page, 'Анна отправила приглашение Борису на почту.', 3500);
        await shot(page, FEATURE, '05-invite-sent');
        await finish();
    }

    // Сцена 3. Письмо-приглашение
    const email = await waitForEmail(boris.email);
    const link = email.html.match(/href="([^"]*\/membership\/duo\/[a-f0-9]+)"/)?.[1]?.replace(/&amp;/g, '&');
    expect(link, 'в письме нет ссылки-приглашения').toBeTruthy();
    {
        const { page, finish } = await startScene(browser, FEATURE, 3, {
            httpCredentials: { username: process.env.MAILPIT_USER ?? '', password: process.env.MAILPIT_PASSWORD ?? '', origin: new URL(MAILPIT_URL).origin },
        });
        await titleCard(page, 'Письмо Борису', `Тема: «${email.subject}»`, 3000);
        await page.setContent(email.html);
        await say(page, 'Такое письмо получает второй участник. Кнопка ведёт на страницу приглашения.', 4500);
        await shot(page, FEATURE, '06-email');
        await finish();
    }

    // Сцена 4. Борис открывает ссылку, входит и присоединяется
    {
        const { page, finish } = await startScene(browser, FEATURE, 4);
        await titleCard(page, 'Борис принимает приглашение', 'У Бориса уже есть аккаунт, но он не вошёл на сайт', 3000);
        await page.goto(link as string);
        await expect(page.getByRole('heading', { name: /приглашает вас в Гудсёрфинг/ })).toBeVisible({ timeout: 30_000 });
        await say(page, 'Страница приглашения: кто пригласил и до какого числа будет членство.', 4000);
        await say(page, 'Если у Бориса уже есть членство, оставшийся срок добавится к концу — ничего не сгорит.', 4000);
        await shot(page, FEATURE, '07-invite-guest');
        await page.getByRole('link', { name: 'Войти и присоединиться' }).click();

        await page.getByLabel('E-mail').waitFor({ timeout: 30_000 });
        await say(page, 'Вход — обычный. Без аккаунта можно зарегистрироваться и снова открыть ссылку.', 3000);
        await page.getByLabel('E-mail').pressSequentially(boris.email, { delay: 20 });
        await page.getByLabel('Пароль', { exact: true }).pressSequentially(boris.password, { delay: 20 });
        await page.getByRole('button', { name: 'Войти', exact: true }).click();

        const accept = page.getByRole('button', { name: 'Присоединиться' });
        await expect(accept).toBeVisible({ timeout: 30_000 });
        await say(page, 'После входа Борис вернулся на страницу приглашения. Жмёт «Присоединиться».', 3500);
        await accept.click();
        await expect(page.getByText(/Готово! Членство активно до/)).toBeVisible({ timeout: 20_000 });
        await say(page, 'Готово: у Бориса членство до того же числа, что и у Анны.', 4000);
        await shot(page, FEATURE, '08-invite-done');
        await finish();
    }

    // Сцена 5. Анна видит, что Борис присоединился
    {
        const { page, finish } = await startScene(browser, FEATURE, 5, { session: anna });
        await page.goto('/membership');
        await scrollTo(page, 'text=с вами — членство активно у обоих');
        await expect(page.getByRole('link', { name: 'Оформить на двоих' })).toHaveCount(0);
        await say(page, 'Анна на странице «Членство» видит, что Борис присоединился. Ссылка больше не нужна.', 4500);
        await say(page, 'Предложение «Оформить на двоих» у неё больше не показывается — членство на двоих уже есть.', 4000);
        await shot(page, FEATURE, '09-owner-joined');
        await titleCard(page, 'Членство на двоих', 'Включается в админке («Тарифы членства») после релиза. Цена — там же.', 4000);
        await finish();
    }
});
