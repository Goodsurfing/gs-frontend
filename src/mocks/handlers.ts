import { rest } from "msw";

export const handlers = [
    rest.get("*/api/v3/verify/email/:id", (req, res, ctx) => res(
        ctx.status(200),
        ctx.json({
            accessToken: "test-access-token",
            mercureToken: "test-mercure-token",
        }),
    )),

    rest.post("*/api/v1/token", (req, res, ctx) => res(
        ctx.status(200),
        ctx.json({
            accessToken: "test-access-token",
            mercureToken: "test-mercure-token",
            roles: ["ROLE_USER"],
        }),
    )),

    rest.post("*/api/v1/email-verifications/resend", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
];
