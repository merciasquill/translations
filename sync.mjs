import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const languageData = {};

const sourceFiles = readdirSync(join(__dirname, "sources"), {
  recursive: true,
  withFileTypes: true,
});

for (const file of sourceFiles) {
  if (!file.isFile()) continue;

  const filePath = join(file.parentPath, file.name);
  const importedData = JSON.parse(readFileSync(filePath, "utf8"));

  for (const key in importedData) {
    languageData[key] = { "en-GB": importedData[key] };
  }
}

const localeFolders = readdirSync(join(__dirname, "locales"), {
  withFileTypes: true,
});

for (const locale of localeFolders) {
  if (!locale.isDirectory()) {
    throw Error("file in locale directory root when directory expected");
  }

  const localesFiles = readdirSync(join(locale.parentPath, locale.name), {
    recursive: true,
    withFileTypes: true,
  });

  for (const file of localesFiles) {
    if (!file.isFile()) continue;

    const filePath = join(file.parentPath, file.name);
    const importedData = JSON.parse(readFileSync(filePath, "utf8"));

    for (const key in importedData) {
      if (!languageData[key]) {
        throw Error(`Key ${key} missing from languageData`);
      }

      if (importedData[key] === languageData[key]["en-GB"]) {
        continue;
      }

      languageData[key][locale.name] = importedData[key];
    }
  }
}

const formattedKeys = {};

for (const key in languageData) {
  const keyParts = key.split(".");

  const formattedFileName = keyParts.slice(0, keyParts.length - 2).join(".");

  if (!formattedKeys[formattedFileName]) {
    formattedKeys[formattedFileName] = [];
  }

  formattedKeys[formattedFileName].push({
    raw: key,
    formatted: keyParts.slice(keyParts.length - 2).join("."),
  });
}

for (const fileName in formattedKeys) {
  const keyData = {};

  const sortedKeys = formattedKeys[fileName].sort((a, b) => {
    if (a.formatted < b.formatted) return -1;
    if (a.formatted > b.formatted) return 1;
    return 0;
  });

  for (const key of sortedKeys) {
    keyData[key.formatted] = languageData[key.raw];
  }

  const jsonFilePath = join(__dirname, "json", fileName + ".json");
  writeFileSync(jsonFilePath, JSON.stringify(keyData));
}

const summaryFilePath = join(__dirname, "json", "summary.json");
writeFileSync(summaryFilePath, JSON.stringify(languageData));
