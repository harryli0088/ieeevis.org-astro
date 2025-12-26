//npx tsx transferMdContent.ts

//this file tries to automatically transfer content
//from the old production site to this new repo

import * as fs from "fs";
import * as path from "path";

const SOURCE_DIR = path.resolve("../ieeevis.org/content");
const TARGET_DIR = path.resolve("./src/pages");

// Recursively get all files in a directory
function getAllFiles(dir: string, extenson = ".md"): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (
      fullPath.endsWith(extenson) &&
      !fullPath.endsWith("welcome.md")
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Read source files
const sourceFiles = getAllFiles(SOURCE_DIR);
const targetFiles = getAllFiles(TARGET_DIR).map((f) =>
  path.relative(TARGET_DIR, f),
);

function getNewLayout(oldLayout: string) {
  if (oldLayout === "page") {
    return `/src/layouts/PageLayout.astro`;
  } else if (oldLayout === "home") {
    return `/src/layouts/HomePageLayout.astro`;
  }
  throw new Error(`Unexpected layout ${oldLayout}`);
}

function parseFile(content: string, targetContent: string | null) {
  if (content.startsWith("---\n")) {
    const split = content.slice("---\n".length).split("---\n");

    const headers = split[0]
      .split("\n")
      .map((row) => {
        if (row.includes("permalink:")) {
          return null;
        } else if (row.includes("layout:")) {
          if (row.includes("layout: landing")) {
            return `layout: /src/layouts/LandingLayout.astro`;
          }
          return `layout: /src/layouts/PageLayout.astro`;
        }
        return row;
      })
      .filter((r) => {
        console.log("ROW", r);
        return r !== null;
      })
      .join("\n");

    const body = split.slice(1).join("---\n");

    return `---\n${headers.trim()}\n---\n\n${body.trim()}`;
  } else {
    return content;
  }
}

// Copy or update files
sourceFiles.forEach((sourceFilePath) => {
  const relativePath = path.relative(SOURCE_DIR, sourceFilePath);
  const targetFilePath = path.join(TARGET_DIR, relativePath);

  const targetDir = path.dirname(targetFilePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFileExists = fs.existsSync(targetFilePath);

  fs.writeFileSync(
    targetFilePath,
    parseFile(
      fs.readFileSync(sourceFilePath, "utf-8"),
      targetFileExists ? fs.readFileSync(targetFilePath, "utf-8") : null,
    ),
    "utf-8",
  );
  if (targetFileExists) {
    console.log(`Overwrote existing file: ${relativePath}`);
  } else {
    // Target file doesn't exist → copy
    console.log(`Copied new file        : ${relativePath}`);
  }
});

// Notify about extra files in target
const extraFiles = targetFiles.filter(
  (file) =>
    !sourceFiles.map((f) => path.relative(SOURCE_DIR, f)).includes(file),
);
if (extraFiles.length > 0) {
  console.warn("Extra files in target directory:", extraFiles);
}

console.log("Sync completed.");
