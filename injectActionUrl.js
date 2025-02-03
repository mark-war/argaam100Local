import fs from "fs";
import path from "path";

// Get the build output directory (dist folder)
const buildDir = path.join(process.cwd(), "dist");

// Path to web.config inside dist
const webConfigPath = path.join(buildDir, "web.config");

function injectActionUrl() {
  // Check if the web.config exists in the dist folder
  if (!fs.existsSync(webConfigPath)) {
    console.error(`web.config not found at path: ${webConfigPath}`);
    return;
  }

  let webConfig = fs.readFileSync(webConfigPath, "utf-8");

  // Modify the URL in web.config (or other operations)
  webConfig = webConfig.replace(
    '<action type="Rewrite" url="/" />',
    '<action type="Rewrite" url="/argaam100/dist/" />'
  );

  fs.writeFileSync(webConfigPath, webConfig);
  console.log("Action URL injected successfully into dist/web.config!");
}

export default injectActionUrl;
