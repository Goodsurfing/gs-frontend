import { withAuditBrowser, BASE_URL, API_URL } from './harness.mjs';

const IAP_TOKEN = 'yiap_66fa6fb58d3632ec2a187696244db59ea858be9c';

await withAuditBrowser(async ({ newAuthedContext, apiRequestCtx }) => {
    async function login(email, password) {
        const resp = await apiRequestCtx.post(`${API_URL}/api/v1/token`, {
            headers: { 'X-Forwarded-Authorization': `Bearer ${IAP_TOKEN}` },
            data: { email, password },
        });
        return resp.json();
    }

    const bobEmail = 'gs-chat-bob-2026c@example.com';
    const bob = await login(bobEmail, 'ChatTest123!');
    console.log('Bob logged in, roles:', bob.roles, 'has token:', !!bob.accessToken);

    const ctx = await newAuthedContext();

    // userSlice.initAuthData() (run once on app bootstrap) only hydrates
    // authData if ALL FOUR of these keys are present — user/mercureToken
    // included, not just token/roles — otherwise PrivateRouteGuard treats
    // the session as logged-out and bounces to /signin.
    await ctx.addInitScript(
        ({ email, t, mt, r }) => {
            localStorage.setItem('user', JSON.stringify({ username: email }));
            localStorage.setItem('token', JSON.stringify(t));
            localStorage.setItem('mercureToken', JSON.stringify(mt));
            localStorage.setItem('roles', JSON.stringify(r));
        },
        {
            email: bobEmail, t: bob.accessToken, mt: bob.mercureToken, r: bob.roles ?? [],
        },
    );

    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

    await page.goto(`${BASE_URL}/ru/messenger`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);
    console.log('URL after nav:', page.url());
    await page.screenshot({ path: '/tmp/audit-shots/chat_list.png' });

    // Navigate directly to the chat URL rather than clicking the list item —
    // more deterministic for automation than waiting on SPA client-side
    // routing state to settle before typing.
    await page.goto(`${BASE_URL}/ru/messenger/2150`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: '/tmp/audit-shots/chat_open.png' });

    const composer = await page.$('textarea[placeholder*="сообщение" i]');
    if (composer) {
        const outgoingText = `Живой UI-тест: ответ от Боба ${Date.now() % 100000}`;
        await composer.click();
        await composer.fill(outgoingText);
        await composer.press('Enter');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/tmp/audit-shots/chat_after_send.png' });
        const sentVisible = await page.$(`text=${outgoingText}`);
        console.log('Outgoing message visible after send:', !!sentVisible);
    } else {
        console.log('No message composer input found on page');
    }

    console.log('CONSOLE_ERRORS:', JSON.stringify(consoleErrors.filter((e) => !e.includes('id.vk.ru') && !e.includes('vkid'))));
    await page.close();
});
