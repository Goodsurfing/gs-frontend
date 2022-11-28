module.exports = {
    preset: "ts-jest",
    verbose: true,
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|less|scss|sss|styl)$":
            "<rootDir>/node_modules/identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};
