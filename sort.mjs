import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceFiles = readdirSync(join(__dirname, "sources"), {
  recursive: true,
  withFileTypes: true,
});

for (const file of sourceFiles) {
  if (!file.isFile()) continue;

  const filePath = join(file.parentPath, file.name);
  const importedData = JSON.parse(readFileSync(filePath, "utf8"));

  const sortedData = {};

  const keys = Object.keys(importedData).sort();
  for (const key of keys) sortedData[key] = importedData[key];

  writeFileSync(filePath, JSON.stringify(sortedData, null, 2));
}
