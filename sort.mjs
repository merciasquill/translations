import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDirectories = readdirSync(join(__dirname, "sources"));

for (const directory of sourceDirectories) {
  const sourceFiles = readdirSync(join(__dirname, "sources", directory));

  for (const file of sourceFiles) {
    const filePath = join(__dirname, "sources", directory, file);
    const importedData = JSON.parse(readFileSync(filePath, "utf8"));

    const sortedData = {};

    const keys = Object.keys(importedData).sort();
    for (const key of keys) sortedData[key] = importedData[key];

    writeFileSync(`./sources/${directory}/${file}`, JSON.stringify(sortedData, null, 2));
  }
}
