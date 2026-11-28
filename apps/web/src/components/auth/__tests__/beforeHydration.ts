import { expect } from "vitest";

/**
 * Серверная разметка формы авторизации безопасна до загрузки скриптов (GS-335):
 * кнопка отправки выключена — браузер не отправит форму GET на ту же страницу;
 * method="post" — даже если отправит, ничего не попадёт в адрес; поля без value
 * (гидратация не перезапишет введённое) и без name.
 */
export function expectSafeBeforeHydration(html: string, fields: number) {
    expect(html).toMatch(/<form[^>]*method="post"/);
    expect(html).toMatch(/<button type="submit" disabled=""/);
    const inputs = html.match(/<input[^>]*type="(email|password)"[^>]*>/g) ?? [];
    expect(inputs).toHaveLength(fields);
    for (const input of inputs) {
        expect(input).not.toMatch(/\svalue=/);
        expect(input).not.toMatch(/\sname=/);
        expect(input).toContain('placeholder=" "');
    }
}
