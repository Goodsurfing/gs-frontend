import { withAuditBrowser, BASE_URL } from './harness.mjs';

await withAuditBrowser(async ({ newAuthedContext }) => {
    const ctx = await newAuthedContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/ru/offers-map`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Clusters are drawn on a <canvas> (Yandex Maps' own tile+marker
    // rendering), not real DOM nodes — no selector can find them. Click
    // the visually known "358" Europe cluster position from the initial
    // world-view screenshot directly, checking after each click.
    let opened = false;
    for (let i = 0; i < 12 && !opened; i += 1) {
        await page.mouse.click(917, 522);
        await page.waitForTimeout(1500);
        opened = await page.evaluate(() => !!document.querySelector('.ymaps-2-1-79-balloon'));
        await page.screenshot({ path: `/tmp/audit-shots/cluster_attempt_${i}.png` });
        console.log(`attempt ${i}: opened=${opened}`);
    }
    // At this point we're zoomed into the Moscow region with only small
    // clusters left ("56", "39" etc) — click directly on one of those.
    if (!opened) {
        for (const [x, y] of [[1040, 335], [890, 397], [955, 493]]) {
            await page.mouse.click(x, y);
            await page.waitForTimeout(1500);
            opened = await page.evaluate(() => !!document.querySelector('.ymaps-2-1-79-balloon'));
            console.log(`final attempt (${x},${y}): opened=${opened}`);
            if (opened) break;
        }
    }
    await page.screenshot({ path: '/tmp/audit-shots/cluster_final_state.png' });
    console.log('BALLOON_OPENED:', opened);

    if (opened) {
        await page.screenshot({ path: '/tmp/audit-shots/cluster_balloon_final.png' });
        const info = await page.evaluate(() => {
            const balloon = document.querySelector('.ymaps-2-1-79-balloon');
            const tabs = document.querySelector('[class*="ymaps-2-1-79-b-cluster-tabs"]');
            return { balloonHTML: balloon?.outerHTML?.slice(0, 1500), hasNativeTabs: !!tabs };
        });
        console.log('INFO:', JSON.stringify(info));
    }
    await ctx.close();
});
