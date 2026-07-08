import { describe, it, expect } from "vitest";
import { setupStore } from "./store";
import { userActions } from "@/entities/User";
import { setRegisterUserData } from "./reducers/registerSlice";

/**
 * Регресс-тест для PR gs-frontend#342 + хотфиксы v0.1.22/23 (#346, баг П27):
 * logout должен полностью сбрасывать RTK Query-кэш всех api-слайсов и
 * slice-данные (profile/gallery/admin/...), чтобы данные предыдущего
 * пользователя не "смешивались" со следующим при смене аккаунта.
 *
 * Но ТОЛЬКО когда до этого была активная сессия (authData) — authMiddleware
 * дёргает logout() и на 401 у гостя (например, гостевой /profile), и полный
 * сброс в этом случае обнулял бы кэш при активной подписке, роняя форму
 * входа в вечный спиннер.
 */
describe("rootReducer — сброс стейта при logout", () => {
    it("полностью сбрасывает кэш RTK Query при выходе из активной сессии", () => {
        const store = setupStore();

        // initAuthData поднимает _inited в true — так же, как при загрузке
        // приложения с уже залогиненным пользователем.
        store.dispatch(userActions.initAuthData());
        store.dispatch(userActions.setAuthData({
            username: "vol@test.com",
            token: "fake-jwt",
            mercureToken: "fake-mercure",
            rememberMe: true,
            roles: ["ROLE_USER"],
        }));

        // Данные другого слайса (не user) — чтобы отличить "полный сброс стора"
        // от обычной работы userReducer.logout, который и сам чистит authData
        // независимо от полного сброса (см. вторую проверку ниже).
        store.dispatch(setRegisterUserData({ id: "prev-user-id", email: "prev@test.com" }));

        expect(store.getState().user.authData).toBeDefined();
        expect(store.getState().user._inited).toBe(true);
        expect(store.getState().register.id).toBe("prev-user-id");

        store.dispatch(userActions.logout());

        const state = store.getState();
        expect(state.user.authData).toBeUndefined();
        // Ключевая проверка регресса (баг П27, "данные смешиваются"): данные
        // предыдущего юзера из другого слайса реально стёрлись, а не только
        // authData в user-слайсе.
        expect(state.register.id).toBe("");
        expect(state.register.email).toBe("");
        // _inited должен сохраниться, а не сброситься к initial (иначе роутер
        // ловит "Cannot assign to read only property" и падает белым экраном —
        // см. комментарий в store.ts).
        expect(state.user._inited).toBe(true);
    });

    it("не трогает кэш при logout без активной сессии (гостевой 401)", () => {
        const store = setupStore();

        const stateBefore = store.getState();

        store.dispatch(userActions.logout());

        const stateAfter = store.getState();

        // Ключевая проверка регресса: без предварительной authData полный
        // сброс стейта не должен происходить — только обычная работа
        // userSlice-редьюсера (authData как был undefined, так и остался).
        expect(stateAfter.user.authData).toBeUndefined();
        expect(stateAfter.register).toBe(stateBefore.register);
        expect(stateAfter.profile).toBe(stateBefore.profile);
    });
});
