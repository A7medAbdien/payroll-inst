import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

// Define logoService directly in this file to avoid import issues
const logoService = {
  getFaviconPath: () => "/assets/hr_bh/payroll-inst/favicon.png",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 8082,
    proxy: getProxyOptions(),
  },
  build: {
    outDir: `../hr_bh/public/payroll-inst`,
    emptyOutDir: true,
    target: "es2015",
  },
  // Make logoService available to index.html
  define: {
    logoService: JSON.stringify({
      getFaviconPath: logoService.getFaviconPath(),
    }),
  },
});

function getProxyOptions() {
  const config = getCommonSiteConfig();
  const webserver_port = config ? config.webserver_port : 8000;
  if (!config) {
    console.log("No common_site_config.json found, using default port 8000");
  }
  return {
    "^/(app|login|api|assets|files|private)": {
      target: `http://127.0.0.1:${webserver_port}`,
      ws: true,
      router: function(req: any) {
        const site_name = req.headers.host.split(":")[0];
        console.log(`Proxying ${req.url} to ${site_name}:${webserver_port}`);
        return `http://${site_name}:${webserver_port}`;
      },
    },
  };
}

function getCommonSiteConfig() {
  let currentDir = path.resolve(".");
  // traverse up till we find frappe-bench with sites directory
  while (currentDir !== "/") {
    if (
      fs.existsSync(path.join(currentDir, "sites")) &&
      fs.existsSync(path.join(currentDir, "apps"))
    ) {
      let configPath = path.join(currentDir, "sites", "common_site_config.json");
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      }
      return null;
    }
    currentDir = path.resolve(currentDir, "..");
  }
  return null;
}
