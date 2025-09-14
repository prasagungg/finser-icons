import { optimize, type Config } from "svgo";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

const sourceDir = path.resolve(process.cwd(), "icons");
const outputDir = path.resolve(process.cwd(), "src/components/icons");

const toPascalCase = (str: string): string => {
  return str.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());
};

const buildIcons = async (): Promise<void> => {
  await fs.ensureDir(outputDir);
  const files = await glob("**/*.svg", { cwd: sourceDir });
  console.log(`Menemukan ${files.length} ikon untuk di-build...`);

  const svgoConfig: Config = {
    plugins: [
      "removeDimensions",
      "removeXMLNS",
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeEditorsNSData",
      "cleanupAttrs",
      "mergeStyles",
      "inlineStyles",
      "minifyStyles",
      "cleanupIds",
      "removeUselessDefs",
      "cleanupNumericValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortDefsChildren",
      "removeTitle",
      "removeDesc",
      {
        name: "removeAttrs",
        params: {
          attrs: "(fill|stroke)",
        },
      },
    ],
  };

  for (const file of files) {
    const svgPath = path.join(sourceDir, file);

    const parts = file.replace(".svg", "").split(path.sep);
    const componentName = parts.map(toPascalCase).join("") + "Icon";

    const outputPath = path.join(outputDir, `${componentName}.vue`);

    const svgCode = await fs.readFile(svgPath, "utf-8");

    const { data: optimizedSvg } = optimize(svgCode, svgoConfig);

    const relativePath = path.relative(outputDir, outputPath);
    console.log(`📦 Membuat: ${relativePath}`);

    const isOutline = file.toLowerCase().includes("outline");
    let svgWithAttrs = "";

    if (isOutline) {
      svgWithAttrs = optimizedSvg.replace(
        "<svg",
        '<svg stroke="currentColor" fill="none" v-bind="$attrs"'
      );
    } else {
      svgWithAttrs = optimizedSvg
        .replace(/\s*fill=(["'])none\1/g, "")
        .replace("<svg", '<svg fill="currentColor" v-bind="$attrs"');
    }

    const finalVueCode = `<template>
  ${svgWithAttrs}
</template>
`;

    await fs.writeFile(outputPath, finalVueCode);
    console.log(`✅ Berhasil membuat: ${relativePath}`);
  }
  console.log("✨ Build ikon selesai!");
};

buildIcons().catch(console.error);
