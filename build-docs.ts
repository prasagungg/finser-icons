// build-docs.ts
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

const iconDir = path.resolve(process.cwd(), "src/components/icons");
const docsOutputFile = path.resolve(process.cwd(), "docs/icons.md");

const getPropNameFromComponent = (componentName: string): string => {
  const nameWithoutIcon = componentName.replace("Icon", "");
  const parts = nameWithoutIcon.match(/[A-Z][a-z0-9]+/g) || [];
  return parts.map((part) => part.toLowerCase()).join("/");
};

const generateMarkdownForLevel = (levelData: any, level: number): string => {
  let content = "";
  const sortedKeys = Object.keys(levelData).sort();

  for (const key of sortedKeys) {
    const value = levelData[key];

    if (key === "__icons") {
      content += '<div class="vp-doc icon-grid">\n'; // Gunakan class vp-doc
      for (const icon of value) {
        const propName = icon.path.join("/");
        content += `
      <div class="icon-item">
        <SvgIcon name="${propName}" class="icon-preview" />
        <div class="icon-name">${icon.name}</div>
      </div>
    `;
      }
      content += "</div>\n";
    } else {
      content += `${"#".repeat(level)} ${key}\n\n`;
      content += generateMarkdownForLevel(value, level + 1);
    }
  }
  return content;
};

/**
 */
const generateDocs = async () => {
  const files = await glob("**/*.vue", { cwd: iconDir });
  const iconTree = {};

  const nameRegex = /([A-Z][a-z0-9]+)/g;

  for (const file of files) {
    const componentName = file.replace(".vue", "");
    const parts = componentName.replace("Icon", "").match(nameRegex);
    if (!parts) continue;

    const iconName = parts.pop()!;
    const categories = parts;

    let currentLevel: any = iconTree;
    categories.forEach((category) => {
      if (!currentLevel[category]) {
        currentLevel[category] = {};
      }
      currentLevel = currentLevel[category];
    });

    if (!currentLevel.__icons) {
      currentLevel.__icons = [];
    }
    currentLevel.__icons.push({
      name: iconName,
      propName: getPropNameFromComponent(componentName),
    });
  }

  let markdownContent = "# Daftar Ikon\n\n";
  markdownContent +=
    "Berikut adalah daftar semua ikon yang tersedia, diorganisir berdasarkan kategori. Cukup salin dan tempel komponen untuk menggunakannya.\n\n";

  markdownContent += generateMarkdownForLevel(iconTree, 2);

  await fs.writeFile(docsOutputFile, markdownContent);
  console.log("✅ Berhasil memperbarui file dokumentasi: docs/icons.md");
};

generateDocs().catch(console.error);
