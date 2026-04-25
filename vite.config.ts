import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// @ts-ignore — vitest/config types not always found in strict TS 6
import type { UserConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
    const isDev = mode === "development";

    return {
        plugins: [react()],

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@utils": path.resolve(__dirname, "src/shared/utils"),
                "@components": path.resolve(__dirname, "src/components"),
                "@pages": path.resolve(__dirname, "src/pages"),
                "@store": path.resolve(__dirname, "src/store"),
                "@types": path.resolve(__dirname, "src/types"),
                "@assets": path.resolve(__dirname, "src/shared/assets"),
                "@shared": path.resolve(__dirname, "src/shared"),
                "@constants": path.resolve(__dirname, "src/shared/constants"),
            },
        },

        css: {
            modules: {
                generateScopedName: isDev
                    ? "[path][name]__[local]--[hash:base64:5]"
                    : "[hash:base64:8]",
            },
            preprocessorOptions: {
                scss: {
                    api: "modern",
                },
            },
        },

        define: {
            __IS_DEV__: JSON.stringify(isDev),
        },

        esbuild: {
            target: "es2020",
        },

        optimizeDeps: {
            esbuildOptions: {
                target: "es2020",
            },
        },

        server: {
            port: 3000,
            open: true,
        },

        build: {
            outDir: "dist",
            target: ["es2020", "safari14"],
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            if (id.includes("react/") || id.includes("react-dom/") || id.includes("scheduler/")) {
                                return "npm.react";
                            }
                            if (id.includes("react-router") || id.includes("@remix-run")) {
                                return "npm.router";
                            }
                            if (id.includes("@mui/") || id.includes("@emotion/") || id.includes("@popperjs/")) {
                                return "npm.mui";
                            }
                            if (id.includes("@tiptap/") || id.includes("prosemirror") || id.includes("linkifyjs")) {
                                return "npm.editor";
                            }
                            if (id.includes("emoji-picker-react")) {
                                return "npm.emoji";
                            }
                        }
                    },
                },
            },
        },

        assetsInclude: ["**/*.pdf"],

        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["./src/test-setup.ts"],
            include: ["src/**/*.test.{ts,tsx}"],
            env: {
                VITE_API_BASE_URL: "http://localhost",
                VITE_MAIN_URL: "http://localhost",
            },
            css: {
                modules: {
                    classNameStrategy: "non-scoped",
                },
            },
        },
    } as UserConfig;
});
