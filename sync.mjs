import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDirectories = readdirSync(join(__dirname, "sources"));

for (const directory of sourceDirectories) {
  const sourceFiles = readdirSync(join(__dirname, "sources", directory));

  const languageData = {};

  for (const file of sourceFiles) {
    const filePath = join(__dirname, "sources", directory, file);
    const importedData = JSON.parse(readFileSync(filePath, "utf8"));

    for (const key in importedData) {
      const formattedKey = formatKey(directory, key);
      languageData[formattedKey] = { "en-GB": importedData[key] };
    }

    const localeFolders = readdirSync(join(__dirname, "locales"));

    for (const locale of localeFolders) {
      const localePath = join(
        __dirname,
        "locales",
        locale,
        "sources",
        directory,
        file
      );
      const importedLocaleData = JSON.parse(readFileSync(localePath, "utf8"));

      for (const key in importedLocaleData) {
        const formattedKey = formatKey(directory, key);

        if (!languageData[formattedKey]) continue;

        if (importedLocaleData[key] !== languageData[formattedKey]["en-GB"]) {
          languageData[formattedKey][locale] = importedLocaleData[key];
        }
      }
    }
  }

  writeFileSync(`./json/${directory}.json`, JSON.stringify(languageData, null, 2));
}

function formatKey(base, key) {



  const baseWithoutExtension = base.replace(".json", "");
  return key.replace(baseWithoutExtension + ".", "");
}
