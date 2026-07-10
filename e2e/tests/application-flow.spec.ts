import { test, expect, request } from '@playwright/test';
import { API_URL, IAP_TOKEN } from '../config';

/**
 * Самый частый сценарий взаимодействия волонтёра и хоста: волонтёр
 * откликается на вакансию → хост принимает заявку. Живая проверка на
 * стейдже через API (без открытия SPA — см. обоснование CORS/IAP в
 * payment.spec.ts, та же проблема применима к любому кросс-origin запросу
 * с нестандартным заголовком).
 *
 * Использует тестовую вакансию из E2ETestFixtures::makeVacancy() — она
 * пересоздаётся при каждом /api/test/reset (см. global-setup.ts, вызывается
 * один раз перед всеми тестами), поэтому явного reset() в этом файле нет.
 *
 * Ни ID организации, ни ID вакансии не фиксированы: у обеих сущностей
 * #[ORM\GeneratedValue(strategy: 'CUSTOM')]/автоинкремент, и Doctrine's
 * UuidGenerator::generateId() безусловно генерирует новое значение при
 * персисте — заранее выставленный через reflection id (см.
 * E2ETestFixtures::ORG_ID/VOL_ID/HOST_ID) молча игнорируется и никогда не
 * долетает до БД. Поэтому id организации хоста берём из его же профиля
 * (GET /api/v1/personal/profile → host — IRI), а не из константы.
 *
 * Заявка на вакансию уникальна по паре (volunteer, vacancy), у Application
 * нет DELETE-операции — повторный прогон против уже созданной заявки
 * закономерно падает с "application_form_already_exist". Специально НЕ
 * дёргаем свой /api/test/reset здесь: он труннкейтит все user-таблицы
 * глобально и на живом стейдже конкурирует с другими spec-файлами,
 * выполняющимися в рамках того же прогона (например, payment.spec.ts
 * регистрирует одноразового юзера — параллельный reset стирает его
 * посреди теста). Вместо этого отключаем retry для этого файла: тест не
 * идемпотентен по своей природе, и реальный сбой должен быть виден сразу,
 * а не маскироваться повторным прогоном.
 *
 * Тест работает через чистый API-контекст (без page/storageState), поэтому
 * по умолчанию playwright.config.ts прогнал бы его дважды — под проектами
 * "vol" и "host" — на общем vol@test.com, и второй прогон закономерно
 * упал бы той же ошибкой уникальности. Явно закрепляем тест за одним
 * проектом ("vol" — по семантике: волонтёр инициирует сценарий).
 */
test.describe('Волонтёр откликается на вакансию → хост принимает заявку', () => {
    test.describe.configure({ retries: 0 });

    const iapHeaders: Record<string, string> = IAP_TOKEN
        ? { 'X-Forwarded-Authorization': `Bearer ${IAP_TOKEN}` }
        : {};

    const TEST_VACANCY_TITLE = 'E2E Тестовая вакансия — не удалять';

    test('отклик создаёт заявку и чат, принятие меняет статус для обеих сторон', async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'чистый API-тест, не нужно дублировать по storageState-проектам');

        const api = await request.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: iapHeaders,
            ignoreHTTPSErrors: true,
        });

        const volLogin = await api.post('/api/v2/token', {
            data: { email: 'vol@test.com', password: 'Test1234!' },
        });
        expect(volLogin.ok(), await volLogin.text()).toBeTruthy();
        const volAuth = { Authorization: `Bearer ${(await volLogin.json()).token}` };

        const hostLogin = await api.post('/api/v2/token', {
            data: { email: 'host@test.com', password: 'Test1234!' },
        });
        expect(hostLogin.ok(), await hostLogin.text()).toBeTruthy();
        const hostAuth = { Authorization: `Bearer ${(await hostLogin.json()).token}` };

        const hostProfileResp = await api.get('/api/v1/personal/profile', { headers: hostAuth });
        expect(hostProfileResp.ok(), await hostProfileResp.text()).toBeTruthy();
        const hostProfile = await hostProfileResp.json();
        const orgId = String(hostProfile.host).split('/').pop();
        expect(orgId, 'у тестового хоста должна быть организация').toBeTruthy();

        // Находим фикстурную вакансию по названию — id не фиксирован (автоинкремент).
        const vacancyListResp = await api.get(`/api/v3/vacancy/list/${orgId}`);
        expect(vacancyListResp.ok(), await vacancyListResp.text()).toBeTruthy();
        const vacancyList = await vacancyListResp.json();
        const vacancies = Array.isArray(vacancyList) ? vacancyList : vacancyList.data ?? vacancyList['hydra:member'];
        const vacancy = vacancies.find((v: { title?: string; description?: { title?: string } }) => (
            v.title === TEST_VACANCY_TITLE || v.description?.title === TEST_VACANCY_TITLE
        ));
        expect(vacancy, `фикстурная вакансия "${TEST_VACANCY_TITLE}" не найдена в списке организации`).toBeTruthy();
        const vacancyId = vacancy.id;

        // Волонтёр откликается — тот же payload, что форма отклика на карточке
        // вакансии отправляет через useCreateApplicationMutation().
        const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const applyResp = await api.post('/api/v1/applications', {
            data: {
                vacancy: `/api/v1/vacancies/${vacancyId}`,
                startDate,
                endDate,
            },
            headers: volAuth,
        });
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
});
