let data = {};
let currentNode = "start";
let history = [];

window.onload = async () => {
  try {
    data = await fetch("Content.json").then(res => res.json());
    document.getElementById("restart").onclick = () => {
      history = [];
      loadNode("start");
    };
    document.getElementById("search").oninput = searchNodes;
    loadNode("start");
  } catch (err) {
    document.getElementById("question").textContent = "Error loading content.";
    console.error("Failed to load Content.json", err);
  }
};

function loadNode(nodeKey) {
  const node = data[nodeKey];
  if (!node) return;

  currentNode = nodeKey;

  document.getElementById("question").textContent = node.question;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  for (const [text, target] of Object.entries(node.choices)) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => {
      history.push({ question: node.question, answer: text });
      loadNode(target);
    };
    choicesDiv.appendChild(btn);
  }

  updateHistory();
}

function updateHistory() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  history.forEach(step => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Q:</strong> ${step.question}<br><strong>A:</strong> ${step.answer}`;
    list.appendChild(li);
  });
}

function searchNodes() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "";

  if (!searchQuery) return;

  Object.entries(data).forEach(([key, node]) => {
    const questionText = node.question.toLowerCase();

    if (questionText.includes(searchQuery)) {
      const resultItem = document.createElement("div");

      const highlighted = node.question.replace(
        new RegExp(`(${searchQuery})`, "ig"),
        "<mark>$1</mark>"
      );

      resultItem.innerHTML = highlighted;
      resultItem.className = "search-result";

      resultItem.onclick = () => {
        history.push({ question: node.question, answer: "(Search Jump)" });
        loadNode(key);
        document.getElementById("search").value = "";
        resultsDiv.innerHTML = "";
      };

      resultsDiv.appendChild(resultItem);
    }
  });
}
