import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const sourceFiles = readdirSync("./sources");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

for (const source of sourceFiles) {
  const sourcePath = join(__dirname, "sources", source);
  const importedData = JSON.parse(readFileSync(sourcePath, "utf8"));

  const languageData = {};

  for (const key in importedData) {
    const formattedKey = formatKey(source, key);
    languageData[formattedKey] = { "en-GB": importedData[key] };
  }

  const localeFolders = readdirSync("./locales");

  console.log(localeFolders)

  for (const locale of localeFolders) {
    const localePath = join(__dirname, "locales", locale, source);
    const importedLocaleData = JSON.parse(readFileSync(localePath, "utf8"));

    for (const key in importedLocaleData) {
      const formattedKey = formatKey(source, key);

      if (!languageData[formattedKey]) continue;

      if (importedLocaleData[key] !== languageData[formattedKey]["en-GB"]) {
        languageData[formattedKey][locale] = importedLocaleData[key];
      }
    }
  }

  writeFileSync(`./json/${source}`, JSON.stringify(languageData, null, 2));
}

function formatKey(base, key) {
  const baseWithoutExtension = base.replace(".json", "");
  return key.replace(baseWithoutExtension + ".", "");
}
