import type { BrowserContext } from '@playwright/test';
import { BASE_URL } from '../config';

/** Новый фронт (GS-212) за канарейкой: Traefik отдаёт перенесённые адреса новому приложению только с cookie gs_web=1. */
export const enableNewFrontend = async (context: BrowserContext) => {
    await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
};
