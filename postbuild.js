import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs-extra";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define source and destination directories
const sourceDir = `${__dirname}/dist`;
// const enDir = `${__dirname}/dist/en/screener`;
// const arDir = `${__dirname}/dist/ar/screener`;
// const en10Dir = `${__dirname}/dist/en/top-10`;
// const ar10Dir = `${__dirname}/dist/ar/top-10`;
const en100Dir = `${__dirname}/dist/en/argaam-100`;
const ar100Dir = `${__dirname}/dist/ar/argaam-100`;

// Check environment mode (development or production)
const mode = process.env.BUILD_MODE || "development";

// Create language-specific directories and subdirectories if they don't exist
// fs.ensureDirSync(enDir);
// fs.ensureDirSync(arDir);
// fs.ensureDirSync(en10Dir);
// fs.ensureDirSync(ar10Dir);
fs.ensureDirSync(en100Dir);
fs.ensureDirSync(ar100Dir);

// Example of copying files to respective directories with a filter
fs.readdir(sourceDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const srcPath = `${sourceDir}/${file}`;

    if (fs.statSync(srcPath).isFile()) {
      // Copy files differently based on the environment mode
      // fs.copyFileSync(srcPath, `${enDir}/${file}`);
      // fs.copyFileSync(srcPath, `${arDir}/${file}`);
      // fs.copyFileSync(srcPath, `${en10Dir}/${file}`);
      // fs.copyFileSync(srcPath, `${ar10Dir}/${file}`);
      fs.copyFileSync(srcPath, `${en100Dir}/${file}`);
      fs.copyFileSync(srcPath, `${ar100Dir}/${file}`);
    }
  });

  console.log(
    "Build files organized into language-specific folders with subfolders."
  );
});
