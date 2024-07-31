const guideline = `\n \n// Usage Guidelines\n`;
const api_info = `\n \n// Start writing your code from here.\n`;
// this needs to be removed after being used as a template
const usage = `

// Usage guideline
// Instantiate a new trie: let my_trie = new trie()
// Insert a word into the trie: my_trie.insert(word)
// Remove a word from the trie: my_trie.remove(word)
// Query if a word exists in the trie: my_trie.has(word)
// Query if a word is a prefix on another word that exists in the trie: my_trie.startsWith(word)
// Get the size of the trie: my_trie.size`;

const select = document.getElementById("select");
select.addEventListener("change", (e) => {
  getDataStructure(e);
});

async function writeToClipBoard(text) {
  try {
    const res = await navigator.clipboard.writeText(text);
    console.log("Copying to the clip board successful.");
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
      writeToClipBoard(
        ds.content.concat(guideline).concat(ds.usage).concat(api_info)
      );
    } else {
      console.log(res.statusText);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
