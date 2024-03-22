import { loop } from "@/scripts/controller/hitoController";
import AppContext from "@/scripts/lib/core/AppContext";

export default defineContentScript({
  matches: ["https://*/*"],
  async main() {
    const ctx = AppContext.getInstance();
    const chromeHelper = ctx.make("chromeHelper");

    // Listen for messages from the background script
    chromeHelper.addMessageListener((message, sender, sendResponse) => {
      if (message.action === "checkTime") {
        loop()
      }
    });

    loop()
  },
});