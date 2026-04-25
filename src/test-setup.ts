import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/mocks/server";

expect.extend(matchers);

beforeAll(() =>
    server.listen({
        onUnhandledRequest(req, print) {
            if (req.url.toString().startsWith("data:")) return;
            print.warning();
        },
    }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
