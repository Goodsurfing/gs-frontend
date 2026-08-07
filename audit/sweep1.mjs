import { withAuditBrowser, checkPage, printReport, BASE_URL } from './harness.mjs';

await withAuditBrowser(async ({ newAuthedContext }) => {
    const ctx = await newAuthedContext();

    const pages = [
        { url: `${BASE_URL}/ru`, name: 'home_desktop', scrollSteps: 10 },
        { url: `${BASE_URL}/ru/offers-map`, name: 'offers_map', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/blog`, name: 'blog_list', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/news`, name: 'news_list', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/journals`, name: 'journals_list', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/academy-main`, name: 'academy_main', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/membership`, name: 'membership', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/signup`, name: 'signup', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/signin`, name: 'signin', scrollSteps: 1 },
        { url: `${BASE_URL}/ru/our-team`, name: 'our_team', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/ambassadors`, name: 'ambassadors', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/npo`, name: 'npo', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/about-project`, name: 'about_project', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/find-job`, name: 'find_job', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/become-host`, name: 'become_host', scrollSteps: 3 },
        { url: `${BASE_URL}/ru/rules`, name: 'rules', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/feedback`, name: 'feedback', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/donation-map`, name: 'donation_map', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/donation-reports`, name: 'donation_reports', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/donation-rating`, name: 'donation_rating', scrollSteps: 2 },
        { url: `${BASE_URL}/ru/categories`, name: 'categories', scrollSteps: 2 },
    ];

    for (const p of pages) {
        const report = await checkPage(ctx, p);
        printReport(report);
    }

    await ctx.close();
});
