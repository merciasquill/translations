import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const sourceFiles = readdirSync("./sources");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

for (const source of sourceFiles) {
  const sourcePath = join(__dirname, "sources", source);
    const importedData = JSON.parse(readFileSync(sourcePath, "utf8"));


  const sortedData = {};

  const keys = Object.keys(importedData).sort();
  for (const key of keys) sortedData[key] = importedData[key];
 
  writeFileSync(`./sources/${source}`, JSON.stringify(sortedData, null, 2));
}
