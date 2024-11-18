import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: {
    addons: {
      vueTemplate: true,
    },
  },
  vite: () => ({
    plugins: [vue()],
  }),
  manifest: {
    "name": "Hito Kintai Helper",
    "version": "1.1.0",
    "description": "Auto perform check in/out process in time",
    "permissions": [
      "cookies",
      "storage",
      "notifications",
      "alarms",
      "activeTab",
      "tabs"
    ],
    "host_permissions": [
      "<all_urls>"
    ],
    "icons": {
      "16": "images/icon/icon16.png",
      "48": "images/icon/icon48.png",
      "128": "images/icon/icon128.png"
    },
    "action": {
      "default_popup": "popup.html"
    },
    "options_ui": {
      "page": "option.html",
      "open_in_tab": false
    },
    "commands": {
      "wxt:reload-extension": {
        "description": "Reload the extension during development",
        "suggested_key": {
          "default": "Alt+R"
        }
      }
    }
  }
});
