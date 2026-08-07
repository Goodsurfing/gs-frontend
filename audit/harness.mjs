import { chromium, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const IAP_TOKEN = 'yiap_66fa6fb58d3632ec2a187696244db59ea858be9c';
export const BASE_URL = 'https://staging.goodsurfing.org';
export const API_URL = 'https://api-staging.goodsurfing.org';
const SHOT_DIR = '/tmp/audit-shots';
fs.mkdirSync(SHOT_DIR, { recursive: true });

export async function withAuditBrowser(fn) {
    const apiRequestCtx = await request.newContext({ ignoreHTTPSErrors: true });
    const browser = await chromium.launch();

    // Context-level extraHTTPHeaders would apply to EVERY request, including
    // the app's own API calls — clobbering a real user JWT the app sets on
    // its own Authorization header (e.g. /api/v1/profile) with the IAP
    // bypass token, breaking authenticated sessions. So the IAP token is
    // injected per-domain via routing instead: main-site requests get
    // Authorization (they never carry a real app JWT), API requests keep
    // whatever Authorization the app itself set and get the bypass token
    // via X-Forwarded-Authorization instead.
    const newAuthedContext = async (opts = {}) => {
        const ctx = await browser.newContext({
            baseURL: BASE_URL,
            ignoreHTTPSErrors: true,
            viewport: { width: 1280, height: 900 },
            ...opts,
        });
        await ctx.route(`${BASE_URL}/**`, async (route) => {
            const req = route.request();
            const headers = { ...req.headers(), authorization: `Bearer ${IAP_TOKEN}` };
            await route.continue({ headers });
        });
        await ctx.route(`${API_URL}/**`, async (route) => {
            const req = route.request();
            const headers = { ...req.headers() };
            headers['X-Forwarded-Authorization'] = `Bearer ${IAP_TOKEN}`;
            try {
                // Mercure SSE subscriptions (text/event-stream) never resolve
                // on their own — they get aborted mid-flight when the
                // browser context/page closes, which throws here. That's
                // expected teardown noise, not a real failure.
                const response = await apiRequestCtx.fetch(req.url(), {
                    method: req.method(),
                    headers,
                    data: req.postDataBuffer() ?? undefined,
                });
                const responseHeaders = { ...response.headers() };
                delete responseHeaders['content-encoding'];
                delete responseHeaders['content-length'];
                delete responseHeaders['transfer-encoding'];
                await route.fulfill({ status: response.status(), headers: responseHeaders, body: await response.body() });
            } catch {
                await route.abort().catch(() => {});
            }
        });
        return ctx;
    };

    try {
        await fn({ browser, newAuthedContext, apiRequestCtx });
    } finally {
        await browser.close();
        await apiRequestCtx.dispose();
    }
}

// Visit a page, collect console errors + failed requests, screenshot at
// given scroll steps, return a compact report object.
export async function checkPage(ctx, { url, name, waitForSelector, scrollSteps = 3, viewportHeight = 900, clickBefore, extraWait = 1500 }) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
    page.on('requestfailed', (req) => {
        // Ignore aborted/cancelled requests from navigation races, not real bugs.
        const failure = req.failure()?.errorText ?? '';
        if (failure.includes('ERR_ABORTED')) return;
        failedRequests.push(`${req.method()} ${req.url()} :: ${failure}`);
    });

    let httpStatus = null;
    try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        httpStatus = resp?.status() ?? null;
    } catch (e) {
        await page.close();
        return {
            name, url, error: `navigation failed: ${e.message}`, consoleErrors, failedRequests, httpStatus,
        };
    }

    if (waitForSelector) {
        try {
            await page.waitForSelector(waitForSelector, { timeout: 10000 });
        } catch {
            consoleErrors.push(`TIMEOUT waiting for selector: ${waitForSelector}`);
        }
    } else {
        await page.waitForTimeout(extraWait);
    }

    if (clickBefore) {
        try { await clickBefore(page); } catch (e) { consoleErrors.push(`clickBefore failed: ${e.message}`); }
        await page.waitForTimeout(extraWait);
    }

    const shots = [];
    for (let i = 0; i < scrollSteps; i += 1) {
        const shotPath = path.join(SHOT_DIR, `${name}_${String(i + 1).padStart(2, '0')}.png`);
        await page.screenshot({ path: shotPath });
        shots.push(shotPath);
        if (i < scrollSteps - 1) {
            await page.evaluate((h) => window.scrollBy(0, h * 0.85), viewportHeight);
            await page.waitForTimeout(800);
        }
    }

    const pageTitle = await page.title();
    const finalUrl = page.url();
    await page.close();

    return {
        name, url, finalUrl, httpStatus, pageTitle, consoleErrors, failedRequests, shots,
    };
}

export function printReport(report) {
    const problems = [...report.consoleErrors, ...report.failedRequests];
    const status = report.error ? 'ERROR' : (problems.length ? 'ISSUES' : 'OK');
    console.log(`\n=== [${status}] ${report.name} — ${report.url} ===`);
    if (report.error) console.log('  ERROR:', report.error);
    console.log('  httpStatus:', report.httpStatus, '| title:', report.pageTitle);
    if (report.consoleErrors?.length) {
        console.log('  console errors:');
        report.consoleErrors.forEach((e) => console.log('   -', e.slice(0, 300)));
    }
    if (report.failedRequests?.length) {
        console.log('  failed requests:');
        report.failedRequests.forEach((e) => console.log('   -', e.slice(0, 300)));
    }
    if (report.shots?.length) console.log('  shots:', report.shots.join(', '));
}
