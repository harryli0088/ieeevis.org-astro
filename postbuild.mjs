import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBasePath } from './getBasePath.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_PATH = getBasePath();
console.log("BASE_PATH",BASE_PATH)
const DIST_DIR = path.join(__dirname, 'dist');
const SEARCH_PATTERN = /\/assets\//g;
const REPLACEMENT = `${BASE_PATH}/assets/`;

// File extensions to process
const TEXT_EXTENSIONS = ['.html', '.css', '.js']; //, '.json', '.xml', '.svg', '.txt'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.includes(ext);
}

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(SEARCH_PATTERN, REPLACEMENT);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
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