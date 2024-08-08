const guideline = `\n \n// Usage Guidelines\n`;
const api_info = `\n \n// Start writing your code from here.\n`;
const baseURL = `http://localhost:3000/getJSDS`;
const select = document.getElementById("select");
const notification = document.getElementById("notification");
const localStorage = browser.storage.local;

select.addEventListener("change", handleChangeEvent);

async function handleChangeEvent(event) {
  const dataStructureName = event.target.value;
  let dataStructure = null;
  // check if the ds exits already in the localStorage and isn't invalidated
  try {
    const dsInLocalStorage = await localStorage.get(dataStructureName);
    if (dsInLocalStorage[dataStructureName]?.name) {
      const timeToLive = 0;
      const now = Date.now();
      const differenceInDaysFromLastCached = Math.floor(
        (now - dsInLocalStorage[dataStructureName].timeStamp) /
          (24 * 60 * 60 * 1000)
      );
      if (differenceInDaysFromLastCached > timeToLive) {
        console.log("Clipboard will be written to from the local storage.");
        handleNotification(dsInLocalStorage[dataStructureName].name, "success");
        writeToClipBoard(
          dsInLocalStorage[dataStructureName].content
            .concat(guideline)
            .concat(dsInLocalStorage[dataStructureName].usage)
            .concat(api_info)
        );
        return;
      }
    }
  } catch (error) {
    console.error(error);
  }

  // else fetch it from server and save it to local storage
  try {
    handleNotification(dataStructureName, "fetching");
    dataStructure = await fetchDataStructureFromServer(dataStructureName);
    handleNotification(dataStructure.name, "success");
    writeToClipBoard(
      dataStructure.content
        .concat(guideline)
        .concat(dataStructure.usage)
        .concat(api_info)
    );
    await localStorage.set({
      [dataStructureName]: {
        ...dataStructure,
        timeStamp: Date.now(),
      },
    });
  } catch (error) {
    handleNotification(dataStructureName, "error");
    writeToClipBoard("");
  }
}

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

async function fetchDataStructureFromServer(dataStructureName) {
  const url = `${baseURL}/${dataStructureName}`;
  console.log(`fetching ${dataStructureName} from the server`);
  try {
    const res = await fetch(url);
    if (res.status == 200) {
      const ds = await res.json();
      console.log("fetch from the server was successful.");
      return Promise.resolve(ds);
    } else {
      throw new Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
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
