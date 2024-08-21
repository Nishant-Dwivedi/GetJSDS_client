const guideline = `\n \n// Usage Guidelines\n`;
const api_info = `\n \n// Start writing your code from here.\n`;
const baseURL = `https://getjsds.onrender.com/getjsds`;
const select = document.getElementById("select");
const notification = document.getElementById("notification");

select.addEventListener("change", handleChangeEvent);

async function handleChangeEvent(event) {
  const dataStructureName = event.target.value;
  try {
    handleNotification(dataStructureName, "fetching");
    const dataStructure = await fetchDataStructureFromServer(dataStructureName);
    handleNotification(dataStructure.name, "success");
    await writeToClipBoard(
      dataStructure.content
        .concat(guideline)
        .concat(dataStructure.usage)
        .concat(api_info)
    );
  } catch (error) {
    console.error(error);
    handleNotification(dataStructureName, "error");
    try {
      await writeToClipBoard("");
    } catch (error) {
      console.error("Couldn't clear the clipboard.");
    }
  }
}

async function writeToClipBoard(text) {
  try {
    await navigator.clipboard.writeText(text);
    text != ""
      ? console.log("Data structure was succesfully copied to the clipboard.")
      : console.log("Clipboard was cleared.");
    return Promise.resolve(`Write to clipboard was successfull.`);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function fetchDataStructureFromServer(dataStructureName) {
  const url = `${baseURL}/${dataStructureName}`;
  console.log(`Fetching ${dataStructureName} from the server`);
  try {
    const res = await fetch(url);
    if (res.status == 200) {
      const ds = await res.json();
      console.log("Fetch from the server was successful.");
      return Promise.resolve(ds);
    } else {
      console.log(`The requested resource isn't available on the server.`);
      return Promise.reject(new Error(res.statusText));
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

function handleNotification(dataStr, fetchStatus) {
  let name = dataStr.charAt(0).toUpperCase().concat(dataStr.slice(1));
  if (fetchStatus == "success") {
    notification.style.color = "green";
    notification.textContent = `${name} was copied to the clipboard.`;
  } else if (fetchStatus == "fetching") {
    notification.style.color = "green";
    notification.textContent = `Fetching ${name}...`;
  } else if (fetchStatus == "error") {
    notification.style.color = "red";
    notification.textContent = "Some error has occurred.";
  }
  return;
}
