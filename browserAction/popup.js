const guideline = `\n \n// Usage Guidelines\n`;
const api_info = `\n \n// Start writing your code from here.\n`;
const baseURL = `http://localhost:3000/getJSDS`;
const select = document.getElementById("select");
const notification = document.getElementById("notification");

select.addEventListener("change", (e) => {
  getDataStructure(e);
});

async function writeToClipBoard(text) {
  try {
    const res = await navigator.clipboard.writeText(text);
    text != ""
      ? console.log("Data structure was succesfully copied to the clipboard.")
      : console.log("Clipboard was cleared.");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function getDataStructure(event) {
  const url = `${baseURL}/${event.target.value}`;
  console.log(`requesting ${event.target.value} from the server`);
  handleNotification(event.target.value, "fetching");
  try {
    const res = await fetch(url);
    if (res.status == 200) {
      const ds = await res.json();
      console.log("fetch from the server was successful.");
      handleNotification(ds.name, "success");
      writeToClipBoard(
        ds.content.concat(guideline).concat(ds.usage).concat(api_info)
      );
    } else {
      console.log(res.statusText);
      handleNotification(event.target.value, "error");
      writeToClipBoard("");
    }
  } catch (error) {
    console.error(error);
    handleNotification(event.target.value, "error");
    throw new Error(error);
  }
}

function handleNotification(dataStr, fetchStatus) {
  let name = dataStr.charAt(0).toUpperCase().concat(dataStr.slice(1));
  if (fetchStatus == "success") {
    notification.style.color = "green";
    notification.textContent = `${name} fetched successfully.`;
  } else if (fetchStatus == "fetching") {
    notification.style.color = "green";
    notification.textContent = `Fetching ${name}...`;
  } else if (fetchStatus == "error") {
    notification.style.color = "red";
    notification.textContent = "Error occurred.";
  }
  return;
}
