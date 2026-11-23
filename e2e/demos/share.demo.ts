import { expect, request, test } from '@playwright/test';
import { API_URL, BASE_URL, TEST_USERS_PASSWORD } from '../config';
import { authHeaders, createSession, E2eSession } from '../support/session';
import { say, scrollTo, shot, startScene, titleCard } from './support/demo';

/**
 * Демо «Поделиться» (привлечение через организаторов и волонтёров): превью
 * ссылки до/после, окно «Поделиться» у организатора и сразу после публикации,
 * картинка для сторис, значок для сайта, «Поделиться» у волонтёра.
 *
 * Нужна вакансия «Волонтёрство с видом на Байкал» у host@test.com на стейдже
 * (ночной restore её удаляет — перед записью завести заново, см. README).
 */
const FEATURE = 'share';
const DEMO_TITLE = 'Волонтёрство с видом на Байкал';

const login = async (email: string, password: string): Promise<E2eSession> => {
    const api = await request.newContext({ baseURL: API_URL });
    const res = await api.post('/api/v1/token', { data: { email, password } });
    expect(res.ok(), await res.text()).toBeTruthy();
    const { accessToken, mercureToken, roles } = await res.json();
    await api.dispose();
    return { email, password, accessToken, mercureToken, roles: roles ?? [] };
};

/** Превью ссылки в мессенджере — макет, чтобы показать разницу до/после */
const chatMock = (image: string, title: string, description: string, label: string) => `<!doctype html><html lang="ru"><head><meta charset="utf-8"></head>
<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#8fb1a6 linear-gradient(135deg,#a8c5b9,#7aa394);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="position:absolute;top:28px;left:0;right:0;text-align:center;color:#fff;font-size:26px;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.3)">${label}</div>
  <div style="width:520px;background:#fff;border-radius:18px 18px 18px 4px;padding:10px 12px 12px;box-shadow:0 4px 18px rgba(0,0,0,.15)">
    <div style="color:#2481cc;font-size:16px;margin:2px 4px 8px">https://goodsurfing.org/offers/5516</div>
    <div style="border-left:3px solid #2481cc;padding-left:10px">
      <div style="color:#2481cc;font-weight:600;font-size:15px">Гудсёрфинг</div>
      <div style="font-weight:700;font-size:16px;margin:2px 0">${title}</div>
      <div style="font-size:14px;color:#333;line-height:1.35;margin-bottom:8px">${description}</div>
      <img src="${image}" style="width:100%;border-radius:8px;display:block">
    </div>
  </div>
</body></html>`;

test('Демо: поделиться вакансией и значок для сайта', async ({ browser }) => {
    test.setTimeout(10 * 60_000);
    const host = await login('host@test.com', TEST_USERS_PASSWORD);

    // Демо-вакансия организатора
    const api = await request.newContext({ baseURL: API_URL });
    const org = await (await api.get('/api/v1/personal/organization', { headers: authHeaders(host) })).json();
    const list = await (await api.get(`/api/v1/vacancy/list/${org.id}?limit=50&page=1&statuses[]=active`, { headers: authHeaders(host) })).json();
    const vacancy = (list.data as { id: number; title: string }[]).find((item) => item.title === DEMO_TITLE);
    expect(vacancy, `нет вакансии «${DEMO_TITLE}» у host@test.com — завести перед записью`).toBeTruthy();
    const vacancyId = vacancy!.id;

    // Волонтёр Мария: отклик, организатор принимает
    const maria = await createSession(`demo-share-vol-${Date.now()}`, { volunteer: true });
    await api.patch('/api/v1/profile', { data: { firstName: 'Мария', lastName: 'Иванова', locale: 'ru' }, headers: authHeaders(maria) });
    const applied = await api.post('/api/v1/applications', {
        data: { vacancy: `/api/v1/vacancies/${vacancyId}`, startDate: new Date(Date.now() + 30 * 86400_000).toISOString(), endDate: new Date(Date.now() + 60 * 86400_000).toISOString() },
        headers: authHeaders(maria),
    });
    expect(applied.ok(), await applied.text()).toBeTruthy();
    const application = await applied.json();
    const accepted = await api.patch(`/api/v1/application_forms/${application.id}/status`, {
        data: { status: 'accepted' }, headers: { ...authHeaders(host), 'Content-Type': 'application/merge-patch+json' },
    });
    expect(accepted.ok(), await accepted.text()).toBeTruthy();
    await api.dispose();

    const cover = 'https://storage.yandexcloud.net/gs-media-prod/media/thumbnails/large/101200f9a581f44794e6b1b3b699d399.webp';
    const card = `${BASE_URL}/offers/${vacancyId}/card`;

    // Сцена 1. Превью ссылки: было / стало
    {
        const { page, finish } = await startScene(browser, FEATURE, 1);
        await titleCard(page, 'Поделиться вакансией', 'Организаторы и волонтёры рассказывают о вакансиях у себя в соцсетях и на сайтах — и приводят новых людей. Бесплатно, и видно в Метрике.', 5000);
        await page.setContent(chatMock(cover, 'Волонтёрство с видом на Байкал', 'Байкал - Чудо, с которым надо обязательно встретиться…', 'Было: ссылка на вакансию в Telegram'));
        await say(page, 'Раньше ссылка на вакансию в мессенджере выглядела так: голая обложка, без условий.', 4500);
        await shot(page, FEATURE, '01-preview-before');
        await page.setContent(chatMock(card, 'Волонтёрство с видом на Байкал, Иркутская область | Гудсёрфинг', 'Работа в хостеле. Иркутская область. Койко-место, Полный пансион, 40 ч в неделю, от 14 дн.', 'Стало'));
        await page.waitForLoadState('networkidle');
        await say(page, 'Теперь — карточка: фото, название, регион, условия и логотип. Так же в VK, WhatsApp и MAX.', 5000);
        await shot(page, FEATURE, '02-preview-after');
        await finish();
    }

    // Сцена 2. Организатор: «Поделиться» в «Моих вакансиях»
    {
        const { page, finish } = await startScene(browser, FEATURE, 2, { session: host });
        await titleCard(page, 'Организатор делится вакансией', 'Кабинет организатора → «Мои вакансии»', 3000);
        await page.goto('/host/my-offers');
        const cardRow = page.locator('div.bg-white', { has: page.getByText(DEMO_TITLE, { exact: true }) }).first();
        await expect(cardRow).toBeVisible({ timeout: 30_000 });
        await cardRow.scrollIntoViewIfNeeded();
        await say(page, 'У каждой открытой вакансии теперь есть кнопка «Поделиться».', 3500);
        await cardRow.getByRole('button', { name: 'Поделиться' }).click();
        const dialog = page.getByRole('dialog', { name: 'Поделиться вакансией' });
        await expect(dialog.getByRole('link', { name: 'ВКонтакте' })).toBeVisible({ timeout: 20_000 });
        await page.waitForTimeout(1500);
        await say(page, 'Готовый текст поста и картинка — ничего не нужно придумывать.', 4000);
        await shot(page, FEATURE, '03-host-share');
        await say(page, 'Одна кнопка — и пост во ВКонтакте, Telegram или WhatsApp. Для MAX и Instagram — «Скопировать».', 4500);
        await say(page, 'В ссылке — метка: в Метрике видно, сколько людей пришло от организаторов.', 4000);
        await finish();
    }

    // Сцена 3. Сразу после публикации окно открывается само
    {
        const { page, finish } = await startScene(browser, FEATURE, 3, { session: host });
        await page.goto(`/host/my-offers?published=${vacancyId}`);
        const dialog = page.getByRole('dialog', { name: 'Поделиться вакансией' });
        await expect(dialog.getByText('Вакансия опубликована!', { exact: false })).toBeVisible({ timeout: 30_000 });
        await page.waitForTimeout(1200);
        await say(page, 'Самый удачный момент — сразу после публикации: окно «Поделиться» открывается само.', 4500);
        await shot(page, FEATURE, '04-after-publish');
        await finish();
    }

    // Сцена 4. Картинка для сторис
    {
        const { page, finish } = await startScene(browser, FEATURE, 4);
        await page.setContent(`<!doctype html><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;gap:48px;background:#1d2a26;font-family:system-ui,sans-serif;color:#fff">
            <img src="${card}?format=story" style="height:740px;border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,.4)">
            <div style="max-width:420px;font-size:26px;line-height:1.4"><b>Картинка для сторис</b><br><br>Скачивается из того же окна. Ещё одна — для обычного поста.</div></body>`);
        await page.waitForLoadState('networkidle');
        await say(page, 'Для сторис — вертикальная картинка с кнопкой «Откликнуться».', 4500);
        await shot(page, FEATURE, '05-story');
        await finish();
    }

    // Сцена 5. Значок для сайта
    {
        const { page, finish } = await startScene(browser, FEATURE, 5, { session: host });
        await titleCard(page, 'Значок «Мы на Гудсёрфинге»', 'Кабинет организатора → «Организация» → «Значок для сайта»', 3000);
        await page.goto('/host/badge');
        await expect(page.getByRole('button', { name: 'Скопировать код' })).toBeVisible({ timeout: 30_000 });
        await page.waitForTimeout(1500);
        await say(page, 'Значок с рейтингом и числом отзывов — обновляется сам, когда появляются новые отзывы.', 4500);
        await say(page, 'Готовый код для сайта — организатору остаётся вставить его на страницу.', 4000);
        await shot(page, FEATURE, '06-badge-cabinet');
        await scrollTo(page, 'text=Ссылка на вашу страницу');
        await say(page, 'И ссылка на страницу организации — для шапки паблика или поста.', 3500);

        const badgeSrc = `${BASE_URL}/organizations/${org.id}/badge`;
        await page.setContent(`<!doctype html><body style="margin:0;font-family:Georgia,serif;background:#f7f3ea;color:#3b3a36">
            <div style="padding:22px 60px;background:#5b4a3a;color:#fff;font-size:26px">Эко-хутор «Пример» · сайт организатора</div>
            <div style="padding:40px 60px;max-width:900px"><h2 style="font-size:34px;margin:0 0 16px">Волонтёрам</h2>
            <p style="font-size:20px;line-height:1.6">Мы принимаем волонтёров круглый год: помощь по хозяйству, огород, гостевой дом. Жильё и питание — от нас.</p>
            <p style="font-size:20px;line-height:1.6">Все наши вакансии и отзывы волонтёров:</p>
            <a href="#"><img src="${badgeSrc}" width="300" height="100"></a></div></body>`);
        await page.waitForLoadState('networkidle');
        await say(page, 'Так значок выглядит на сайте организатора. Каждая такая ссылка ещё и поднимает Гудсёрфинг в поиске.', 5000);
        await shot(page, FEATURE, '07-badge-site');
        await finish();
    }

    // Сцена 6. Волонтёр делится принятой заявкой
    {
        const { page, finish } = await startScene(browser, FEATURE, 6, { session: maria });
        await titleCard(page, 'Волонтёр рассказывает друзьям', 'Кабинет волонтёра → «Мои заявки», заявку приняли', 3000);
        await page.goto('/volunteer/notes');
        const share = page.getByRole('button', { name: 'Поделиться' }).first();
        await expect(share).toBeVisible({ timeout: 30_000 });
        await say(page, 'Мою заявку приняли — у неё появилась кнопка «Поделиться».', 3500);
        await share.click();
        await expect(page.getByRole('dialog').getByText('Еду волонтёром', { exact: false })).toBeVisible({ timeout: 20_000 });
        await page.waitForTimeout(1200);
        await say(page, 'Текст «Еду волонтёром…» и та же карточка. В ссылке — личный код «Пригласи друга».', 4500);
        await say(page, 'Друг зарегистрировался по ссылке — Марии засчитывается приглашение и значок «Рекомендатор».', 4500);
        await shot(page, FEATURE, '08-volunteer-share');
        await titleCard(page, 'Как поймём, что работает', 'Метрика: переходы с меткой utm_source=share — отдельно от организаторов, волонтёров и значков на сайтах.', 5000);
        await finish();
    }
});
