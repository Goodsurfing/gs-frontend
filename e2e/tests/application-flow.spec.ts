import { test, expect, request, APIRequestContext } from '@playwright/test';
import { API_URL, IAP_TOKEN } from '../config';

/**
 * Пакет e2e-сценариев взаимодействия волонтёра и хоста вокруг заявок на
 * вакансию. Живая проверка на стейдже через API (без открытия SPA — см.
 * обоснование CORS/IAP в payment.spec.ts, та же проблема применима к
 * любому кросс-origin запросу с нестандартным заголовком).
 *
 * Использует тестовые вакансии из E2ETestFixtures::makeVacancy() (5 шт.,
 * "E2E Тестовая вакансия 1..5 — не удалять"; 5-я — с закрытым приёмом
 * заявок) и то, что host@test.com в фикстуре одновременно хост и волонтёр
 * — пересоздаются при каждом /api/test/reset (см. global-setup.ts,
 * вызывается один раз перед всеми тестами), поэтому явного reset() в этом
 * файле нет.
 *
 * Ни ID организации, ни ID вакансий не фиксированы: у обеих сущностей
 * #[ORM\GeneratedValue(strategy: 'CUSTOM')]/автоинкремент, и Doctrine's
 * UuidGenerator::generateId() безусловно генерирует новое значение при
 * персисте — заранее выставленный через reflection id (см.
 * E2ETestFixtures::ORG_ID/VOL_ID/HOST_ID) молча игнорируется и никогда не
 * долетает до БД. Поэтому id организации хоста берём из его же профиля
 * (GET /api/v1/personal/profile → host — IRI), а вакансии находим по
 * названию через публичный GET /api/v3/vacancy/list/{organizationId}.
 *
 * Заявка на вакансию уникальна по паре (volunteer, vacancy), у Application
 * нет DELETE-операции — тесты не идемпотентны против уже созданных заявок.
 * Специально НЕ дёргаем свой /api/test/reset внутри тестов: он труннкейтит
 * все user-таблицы глобально и на живом стейдже конкурирует с другими
 * spec-файлами, выполняющимися в рамках того же прогона (например,
 * payment.spec.ts регистрирует одноразового юзера — параллельный reset
 * стирает его посреди теста). Вместо этого: retries: 0 на весь файл, и там,
 * где сценарий не завязан на общий vol@test.com/host@test.com — свежий
 * одноразовый волонтёр на тест (см. registerFreshVolunteer), чтобы тесты не
 * конфликтовали друг с другом при повторных прогонах и между собой.
 *
 * Все тесты — чистый API-контекст (без page/storageState), поэтому по
 * умолчанию playwright.config.ts прогнал бы их дважды — под проектами "vol"
 * и "host". Явно закрепляем за одним проектом ("vol").
 */
test.describe('Волонтёр и хост: заявки на вакансию', () => {
    test.describe.configure({ retries: 0 });

    const iapHeaders: Record<string, string> = IAP_TOKEN
        ? { 'X-Forwarded-Authorization': `Bearer ${IAP_TOKEN}` }
        : {};

    const login = async (api: APIRequestContext, email: string, password: string) => {
        const resp = await api.post('/api/v2/token', { data: { email, password } });
        expect(resp.ok(), await resp.text()).toBeTruthy();
        return { Authorization: `Bearer ${(await resp.json()).token}` };
    };

    /**
     * Свежий одноразовый волонтёр — регистрация не создаёт Volunteer-профиль
     * автоматически (см. ApplicationFormCreateProcessor::process →
     * UserDoesNotHaveVolunteerProfile), поэтому дополнительно дозаводим его
     * через POST /api/v1/personal/volunteer.
     */
    const registerFreshVolunteer = async (api: APIRequestContext, tag: string) => {
        const email = `e2e-${tag}-${Date.now()}@test.local`;
        const password = 'E2eVolunteer2026!';

        const registerResp = await api.post('/api/v1/users', {
            data: {
                email, plainPassword: password, locale: 'ru', isActive: true,
            },
        });
        expect(registerResp.ok(), await registerResp.text()).toBeTruthy();

        const verifyResp = await api.post('/api/test/verify-email', { data: { email } });
        expect(verifyResp.ok(), await verifyResp.text()).toBeTruthy();

        const auth = await login(api, email, password);

        const volunteerResp = await api.post('/api/v1/personal/volunteer', { data: {}, headers: auth });
        expect(volunteerResp.ok(), await volunteerResp.text()).toBeTruthy();

        return auth;
    };

    const getHostOrgId = async (api: APIRequestContext, hostAuth: Record<string, string>) => {
        const resp = await api.get('/api/v1/personal/profile', { headers: hostAuth });
        expect(resp.ok(), await resp.text()).toBeTruthy();
        const profile = await resp.json();
        const orgId = String(profile.host).split('/').pop();
        expect(orgId, 'у тестового хоста должна быть организация').toBeTruthy();
        return orgId as string;
    };

    const findVacancyByTitle = async (api: APIRequestContext, orgId: string, title: string) => {
        const resp = await api.get(`/api/v3/vacancy/list/${orgId}`);
        expect(resp.ok(), await resp.text()).toBeTruthy();
        const list = await resp.json();
        const vacancies = Array.isArray(list) ? list : list.data ?? list['hydra:member'];
        const vacancy = vacancies.find((v: { title?: string; description?: { title?: string } }) => (
            v.title === title || v.description?.title === title
        ));
        expect(vacancy, `фикстурная вакансия "${title}" не найдена в списке организации`).toBeTruthy();
        return vacancy.id as number;
    };

    const applyToVacancy = async (
        api: APIRequestContext,
        volAuth: Record<string, string>,
        vacancyId: number,
    ) => {
        const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        return api.post('/api/v1/applications', {
            data: { vacancy: `/api/v1/vacancies/${vacancyId}`, startDate, endDate },
            headers: volAuth,
        });
    };

    test('отклик создаёт заявку и чат, принятие меняет статус для обеих сторон', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        const volAuth = await login(api, 'vol@test.com', 'Test1234!');
        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        const vacancyId = await findVacancyByTitle(api, orgId, 'E2E Тестовая вакансия 1 — не удалять');

        // Волонтёр откликается — тот же payload, что форма отклика на карточке
        // вакансии отправляет через useCreateApplicationMutation().
        const applyResp = await applyToVacancy(api, volAuth, vacancyId);
        expect(applyResp.ok(), await applyResp.text()).toBeTruthy();
        const application = await applyResp.json();
        expect(application.id).toBeTruthy();
        // ApplicationFormCreateProcessor заводит чат волонтёр↔хост при первом
        // отклике — это основной канал общения, часть "самого частого пути".
        expect(application.chat, 'отклик должен создать чат с хостом').toBeTruthy();

        // Статус сразу после отклика — "new" (ещё не рассмотрена).
        const freshApplicationResp = await api.get(`/api/v1/applications/${application.id}`, { headers: volAuth });
        expect(freshApplicationResp.ok()).toBeTruthy();
        expect((await freshApplicationResp.json()).status).toBe('new');

        // Хост принимает заявку.
        const acceptResp = await api.patch(`/api/v1/application_forms/${application.id}/status`, {
            data: { status: 'accepted' },
            headers: { ...hostAuth, 'Content-Type': 'application/merge-patch+json' },
        });
        expect(acceptResp.ok(), await acceptResp.text()).toBeTruthy();
        expect((await acceptResp.json()).status).toBe('accepted');

        // Волонтёр видит принятый статус своей заявки.
        const acceptedFromVolResp = await api.get(`/api/v1/applications/${application.id}`, { headers: volAuth });
        expect(acceptedFromVolResp.ok()).toBeTruthy();
        expect((await acceptedFromVolResp.json()).status).toBe('accepted');

        await api.dispose();
    });

    test('хост отклоняет заявку — статус "canceled" виден обеим сторонам', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        const vacancyId = await findVacancyByTitle(api, orgId, 'E2E Тестовая вакансия 2 — не удалять');

        // Свежий волонтёр — не должен конфликтовать с заявкой из первого теста.
        const volAuth = await registerFreshVolunteer(api, 'reject');

        const applyResp = await applyToVacancy(api, volAuth, vacancyId);
        expect(applyResp.ok(), await applyResp.text()).toBeTruthy();
        const application = await applyResp.json();

        const rejectResp = await api.patch(`/api/v1/application_forms/${application.id}/status`, {
            data: { status: 'canceled' },
            headers: { ...hostAuth, 'Content-Type': 'application/merge-patch+json' },
        });
        expect(rejectResp.ok(), await rejectResp.text()).toBeTruthy();
        expect((await rejectResp.json()).status).toBe('canceled');

        const fromVolResp = await api.get(`/api/v1/applications/${application.id}`, { headers: volAuth });
        expect(fromVolResp.ok()).toBeTruthy();
        expect((await fromVolResp.json()).status).toBe('canceled');

        await api.dispose();
    });

    test('повторный отклик на ту же вакансию блокируется', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        const vacancyId = await findVacancyByTitle(api, orgId, 'E2E Тестовая вакансия 3 — не удалять');
        const volAuth = await registerFreshVolunteer(api, 'dup');

        const firstResp = await applyToVacancy(api, volAuth, vacancyId);
        expect(firstResp.ok(), await firstResp.text()).toBeTruthy();

        const secondResp = await applyToVacancy(api, volAuth, vacancyId);
        expect(secondResp.status(), 'повторный отклик на ту же вакансию должен быть отклонён').toBe(400);
        const body = await secondResp.json();
        expect(body.type).toBe('application_form_already_exist');

        await api.dispose();
    });

    test('без активного членства нельзя откликнуться больше 3 раз', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        const vacancyIds = await Promise.all([1, 2, 3, 4].map(
            (n) => findVacancyByTitle(api, orgId, `E2E Тестовая вакансия ${n} — не удалять`),
        ));
        const volAuth = await registerFreshVolunteer(api, 'limit');

        // Свежий волонтёр без активного членства — первые 3 отклика на РАЗНЫЕ
        // вакансии проходят (FREE_APPLICATION_LIMIT в
        // ApplicationFormCreateProcessor), 4-й должен быть заблокирован.
        for (const vacancyId of vacancyIds.slice(0, 3)) {
            const resp = await applyToVacancy(api, volAuth, vacancyId);
            expect(resp.ok(), await resp.text()).toBeTruthy();
        }

        const fourthResp = await applyToVacancy(api, volAuth, vacancyIds[3]);
        expect(fourthResp.status(), 'четвёртый отклик без членства должен быть заблокирован лимитом').toBe(403);
        const body = await fourthResp.json();
        expect(body.type).toBe('application_limit_exceeded');

        await api.dispose();
    });

    test('хост не может откликнуться на вакансию своей же организации', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        // host@test.com в фикстуре одновременно и хост, и волонтёр —
        // реалистичный кейс, встречается на проде.
        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        const vacancyId = await findVacancyByTitle(api, orgId, 'E2E Тестовая вакансия 4 — не удалять');

        const applyResp = await applyToVacancy(api, hostAuth, vacancyId);
        expect(applyResp.status(), 'хост не должен иметь возможность откликнуться на вакансию своей организации').toBe(400);
        const body = await applyResp.json();
        expect(body.type).toBe('cannot_apply_to_own_organization_vacancy');

        await api.dispose();
    });

    test('нельзя откликнуться на вакансию с закрытым приёмом заявок', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL, extraHTTPHeaders: iapHeaders, ignoreHTTPSErrors: true,
        });

        const hostAuth = await login(api, 'host@test.com', 'Test1234!');
        const orgId = await getHostOrgId(api, hostAuth);
        // 5-я фикстурная вакансия — applicationEndDate в прошлом.
        const vacancyId = await findVacancyByTitle(api, orgId, 'E2E Тестовая вакансия 5 — не удалять');
        const volAuth = await registerFreshVolunteer(api, 'closed');

        const applyResp = await applyToVacancy(api, volAuth, vacancyId);
        expect(applyResp.status(), 'отклик на вакансию с закрытым приёмом заявок должен быть отклонён').toBe(400);
        const body = await applyResp.json();
        expect(body.type).toBe('application_period_closed');

        await api.dispose();
    });
});
