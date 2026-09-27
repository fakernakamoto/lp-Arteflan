import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "vite.config.ts",
  "src/routes/__root.tsx",
  "src/routes/index.tsx",
  "src/routes/api/lead.ts",
  "src/components/landing/ContactQuiz.tsx",
  ".env.example",
];

const errors = [];
for (const file of requiredFiles) {
  try {
    await access(resolve(root, file));
  } catch {
    errors.push(`Arquivo obrigatório ausente: ${file}`);
  }
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
for (const script of ["build", "typecheck"]) {
  if (!packageJson.scripts?.[script]) {
    errors.push(`Script npm ausente: ${script}`);
  }
}

const envExample = await readFile(resolve(root, ".env.example"), "utf8");
for (const key of [
  "MAKE_ARTEFLAN_WEBHOOK_URL",
  "VITE_ARTEFLAN_WHATSAPP_NUMBER",
  "VITE_ASSET_ORIGIN",
]) {
  if (!envExample.includes(`${key}=`)) {
    errors.push(`Variável ausente no .env.example: ${key}`);
  }
}

const leadRoute = await readFile(resolve(root, "src/routes/api/lead.ts"), "utf8");
if (!leadRoute.includes('process.env["MAKE_ARTEFLAN_WEBHOOK_URL"]')) {
  errors.push("A rota /api/lead não usa MAKE_ARTEFLAN_WEBHOOK_URL no servidor.");
}
if (/hook\.us2\.make\.com/i.test(leadRoute)) {
  errors.push("Webhook do Make está gravado diretamente na rota do servidor.");
}

const sourceFiles = [
  "src/routes/api/lead.ts",
  "src/components/landing/ContactQuiz.tsx",
  "src/components/landing/WhatsAppFab.tsx",
];
for (const file of sourceFiles) {
  const content = await readFile(resolve(root, file), "utf8");
  if (/hook\.us2\.make\.com/i.test(content)) {
    errors.push(`Webhook do Make exposto em: ${file}`);
  }
}

if (errors.length) {
  console.error("\nFalha na verificação de deploy:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Verificação de deploy concluída sem problemas estruturais.");
