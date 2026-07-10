import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для бага, который завела фича "международный клуб"
 * (international_5000): у пользователя впервые стало возможно иметь больше
 * одного активного членства одновременно (REGULAR + INTERNATIONAL — они не
 * взаимоисключающие, см. Tariff.category на бэке).
 *
 * До этой фичи "какое членство только что купили" на этой странице
 * определялось по /membership/current (единственное активное членство,
 * других не бывает) — этого было достаточно. Теперь если у юзера уже ЕСТЬ
 * активное membership (например host_4990) и он покупает ВТОРОЕ
 * (international_5000), /membership/current вернёт неоднозначный результат
 * (какое из двух — не гарантировано), а membership.isActive был бы true ещё
 * ДО того, как новый платёж подтвердится — поллинг завершился бы мгновенно,
 * показав контент для чужого/старого членства.
 *
 * Компонент слишком завязан на роутинг/auth/RTK Query с поллингом для
 * полного рендер-теста — проверяем исходник, как и в PaymentPage.regression.test.ts.
 */
describe("PaymentSuccessPage multi-membership regress-guard", () => {
    const source = readFileSync(join(__dirname, "PaymentSuccessPage.tsx"), "utf-8");

    it("определяет купленный тариф через payment.tariffCode, а не только через membership.tariff", () => {
        expect(source).toMatch(/purchasedTariffCode\s*=\s*payment\?\.tariffCode/);
    });

    it("останавливает поллинг по payment.status, а не по membership.isActive", () => {
        // membership?.isActive могло быть true с самого начала, если у юзера
        // уже было другое активное членство — тогда поллинг ждать нового
        // платежа не должен опираться на этот сигнал вообще.
        expect(source).not.toMatch(/setShouldPoll\(false\)[\s\S]{0,40}membership\?\.isActive/);
        expect(source).toMatch(/payment\?\.status === "SUCCESS"[\s\S]{0,60}setShouldPoll\(false\)/);
    });

    it("гейты рендера ждут payment.status, а не membership.isActive", () => {
        expect(source).toMatch(/shouldPoll && payment\?\.status !== "SUCCESS"/);
        expect(source).toMatch(/timedOut && payment\?\.status !== "SUCCESS"/);
    });

    it("различает international как отдельный вид покупки, не сваливает в volunteer/host", () => {
        expect(source).toMatch(/TARIFF_CODE\.INTERNATIONAL/);
        expect(source).toMatch(/INTERNATIONAL_BENEFITS/);
    });
});
