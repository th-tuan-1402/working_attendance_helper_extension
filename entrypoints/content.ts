import { loop, changeKintaiStatusWithinTime } from "@/scripts/controller/hitoController";
import AppContext from "@/scripts/lib/core/AppContext";

export default defineContentScript({
  matches: ["https://*/*"],
  async main() {
    const ctx = AppContext.getInstance();
    const chromeHelper = ctx.make("chromeHelper");

    // Listen for messages from the background script
    chromeHelper.addMessageListener((message) => {
      if (message.action === "checkTime") {
        changeKintaiStatusWithinTime()
      }
    });

    loop()
  },
});