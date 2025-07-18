let data = {};
let history = [];

function getContentFile() {
  const params = new URLSearchParams(window.location.search);
  return params.get('content') || 'Content.json';
}

window.addEventListener("DOMContentLoaded", async () => {
  const contentFile = getContentFile();

  try {
    const response = await fetch(contentFile);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    data = await response.json();
  } catch (err) {
    console.error("Failed to load content file:", err);
    return;
  }

  const restartBtn = document.getElementById("restart");
  if (restartBtn) {
    restartBtn.onclick = () => location.href = 'index.html';
  }

  // Search panel toggle setup
  const toggleSearchBtn = document.getElementById("toggle-search");
  const searchPanel = document.getElementById("search-panel");
  if (toggleSearchBtn && searchPanel) {
    toggleSearchBtn.onclick = () => {
      searchPanel.classList.toggle("expanded");
    };
  }

  // Search input handler
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.oninput = searchNodes;
  }

  const startNode = data["start"];
  if (startNode) {
    history = [{ question: startNode.question, answer: "Start" }];
    updateHistory();
    loadNode("start");
  } else {
    document.getElementById("question").innerText = "Error: 'start' node not found.";
  }
});

function loadNode(id) {
  const node = data[id];
  if (!node) {
    console.warn(`Node '${id}' not found`);
    return;
  }

  document.getElementById("question").innerText = node.question;
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  node.choices?.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => {
      history.push({ question: node.question, answer: choice.text });
      updateHistory();
      loadNode(choice.next);
    };
    choicesDiv.appendChild(btn);
  });
}

function updateHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";
  history.forEach(step => {
    const li = document.createElement("li");
    li.innerText = `${step.question} → ${step.answer}`;
    historyList.appendChild(li);
  });
}

function searchNodes() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "";

  if (!searchInput) {
    resultsDiv.style.display = "none";
    return;
  }

  const matches = Object.entries(data).filter(([key, node]) =>
    node.question.toLowerCase().includes(searchInput)
  );

  if (matches.length === 0) {
    resultsDiv.style.display = "none";
    return;
  }

  resultsDiv.style.display = "block";

  matches.forEach(([key, node]) => {
    const div = document.createElement("div");
    div.className = "search-result";
    const regex = new RegExp(`(${searchInput})`, "gi");
    div.innerHTML = node.question.replace(regex, "<mark>$1</mark>");
    div.onclick = () => {
      loadNode(key);
      document.getElementById("search").value = "";
      resultsDiv.innerHTML = "";
      resultsDiv.style.display = "none";
    };
    resultsDiv.appendChild(div);
  });
}

document.getElementById("toggle-history").onclick = () => {
  const historyDiv = document.getElementById("history-bar");
  const toggleBtn = document.getElementById("toggle-history");

  if (historyDiv.style.maxHeight === "0px") {
    historyDiv.style.maxHeight = "150px";
    historyDiv.style.opacity = "1";
    historyDiv.style.padding = "10px 20px";
    toggleBtn.innerText = "Hide Path";
  } else {
    historyDiv.style.maxHeight = "0px";
    historyDiv.style.opacity = "0";
    historyDiv.style.padding = "0";
    toggleBtn.innerText = "Show Path";
  }
};
