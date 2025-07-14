let data = {};
let currentNode = "start";
let history = [];  // Track previous questions and answers

window.onload = async () => {
  try {
    data = await fetch("Content.json").then(res => res.json());
    document.getElementById("restart").onclick = () => {
      history = [];  // Clear history on restart
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
      // Add current question and chosen answer before loading next node
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
  const results = [];

  Object.keys(data).forEach(key => {
    const node = data[key];
    if (node.question.toLowerCase().includes(searchQuery)) {
      results.push(node.question);
    }
  });

  document.getElementById("search-results").innerHTML = results.join("<br>");
}
