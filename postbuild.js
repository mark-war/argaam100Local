import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs-extra";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define source and destination directories
const sourceDir = `${__dirname}/dist`;
const enDir = `${__dirname}/dist/en/screener`;
const arDir = `${__dirname}/dist/ar/screener`;

// Create language-specific directories and subdirectories if they don't exist
fs.ensureDirSync(enDir);
fs.ensureDirSync(arDir);

// Example of copying files to respective directories with a filter
fs.readdir(sourceDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const srcPath = `${sourceDir}/${file}`;

    if (fs.statSync(srcPath).isFile()) {
      // For example, copying files to specific language directories
      // Here you could add logic to determine which files go where
      fs.copyFileSync(srcPath, `${enDir}/${file}`);
      fs.copyFileSync(srcPath, `${arDir}/${file}`);
    }
  });

  console.log(
    "Build files organized into language-specific folders with subfolders."
  );
});
