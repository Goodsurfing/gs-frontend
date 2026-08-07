import { withAuditBrowser, checkPage, printReport, BASE_URL } from './harness.mjs';

const VACANCY_ID = '6941';

await withAuditBrowser(async ({ newAuthedContext }) => {
    const ctx = await newAuthedContext();

    const pages = [
        { url: `${BASE_URL}/ru/offers/${VACANCY_ID}`, name: 'offer_detail', scrollSteps: 6 },
        { url: `${BASE_URL}/ru/host`, name: 'host_cabinet', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/volunteer`, name: 'volunteer_cabinet', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/profile`, name: 'profile', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/messenger`, name: 'messenger', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/favorite-offers`, name: 'favorite_offers', scrollSteps: 2 },
    ];

    for (const p of pages) {
        const report = await checkPage(ctx, p);
        printReport(report);
    }

    await ctx.close();
});
