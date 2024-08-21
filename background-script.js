browser.runtime.onInstalled.addListener(handleInstall);

async function handleInstall({ reason }) {
  if (reason == "install") {
    const url = browser.runtime.getURL("./onboard/installed.html");
    await browser.tabs.create({ url });
    browser.runtime.onInstalled.removeListener(handleInstall);
  }
  return;
}
