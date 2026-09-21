import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // distDir tuỳ chỉnh (next.config.ts) — máy dev không có quyền admin để
    // dùng lại .next mặc định.
    "build-output/**",
    // File tự sinh của Prisma Client
    "src/generated/prisma/**",
  ]),
]);

export default eslintConfig;
