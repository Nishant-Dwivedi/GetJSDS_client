browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  switch (reason) {
    case "install":
      {
        const url = browser.runtime.getURL("./onboard/installed.html");
        await browser.tabs.create({ url });
      }
      break;
  }
});
