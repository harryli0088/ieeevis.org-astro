// This postbuild script is necessary to rewrite `/asset/**/*` paths for files stored in `public/assets`.
// By default, Astro copies everything from the public folder as is (https://docs.astro.build/en/basics/project-structure/#public),
// and doesn't know that we need to rewrite the paths using the base path argument in `astro.config.mjs`.
// As such, this script looks through all the static web files, and rewrites the imports to prepend the BASE_PATH

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_PATH = process.env.BASE_PATH || "/";
const DIST_DIR = path.join(__dirname, 'dist');
const REPLACEMENTS = [
  { pattern: /\/assets\//g, replacement: `${BASE_PATH}/assets/` },
  // Add more specific patterns as needed
  { pattern: /href="\/(?!year\/)/g, replacement: `href="${BASE_PATH}/` },
  { pattern: /src="\/(?!year\/)/g, replacement: `src="${BASE_PATH}/` },
];

// File extensions to process
const TEXT_EXTENSIONS = ['.html', '.css', '.js']; //, '.json', '.xml', '.svg', '.txt'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.includes(ext);
}

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    for (const { pattern, replacement } of REPLACEMENTS) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        hasChanges = true;
        content = newContent;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${path.relative(DIST_DIR, filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  let filesProcessed = 0;
  let filesUpdated = 0;

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && shouldProcessFile(fullPath)) {
        filesProcessed++;
        if (replaceInFile(fullPath)) {
          filesUpdated++;
        }
      }
    }
  }

  walk(dir);
  return { filesProcessed, filesUpdated };
}

console.log(`Starting post-build asset path replacement...`);
console.log(`Base path: ${BASE_PATH}`);
console.log(`Distribution directory: ${DIST_DIR}`);
console.log('---');

const { filesProcessed, filesUpdated } = walkDirectory(DIST_DIR);

console.log('---');
console.log(`✓ Complete! Processed ${filesProcessed} files, updated ${filesUpdated} files.`);