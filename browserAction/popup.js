const select = document.getElementById("select");
select.addEventListener("change", (e) => {
  getDataStructure(e);
});

async function writeToClipBoard(text) {
  try {
    const res = await navigator.clipboard.writeText(text);
    console.log("write to cb completed");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function getDataStructure(event) {
  const url = `http://localhost:3001/ds/${event.target.value}`;
  console.log(`requesting ${event.target.value} from the server`);
  try {
    const res = await fetch(url);
    if (res.status == 200) {
      const ds = await res.json();
      writeToClipBoard(ds.content);
      console.log("copied to clip board");
    } else {
      writeToClipBoard(
        `The requested data structure could not be found on the server.`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
