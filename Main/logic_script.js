let data = {};
let currentNode = "start";

window.onload = async () => {
  data = await fetch("adventure.json").then(res => res.json());
  document.getElementById("restart").onclick = () => loadNode("start");
  document.getElementById("search").oninput = searchNodes;
  loadNode(currentNode);
};

function loadNode(nodeKey) {
  currentNode = nodeKey;
  const node = data[nodeKey];
  document.getElementById("question").textContent = node.question;
  
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  
  for (const [choiceText, nextKey] of Object.entries(node.choices)) {
    const btn = document.createElement("button");
    btn.textContent = choiceText;
    btn.onclick = () => loadNode(nextKey);
    choicesDiv.appendChild(btn);
  }

  document.getElementById("search-results").innerHTML = "";
  document.getElementById("search").value = "";
}

function searchNodes(e) {
  const query = e.target.value.toLowerCase();
  const results = Object.entries(data).filter(([key, node]) =>
    node.keywords.some(word => word.includes(query))
  );

  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "";
  results.forEach(([key, node]) => {
    const btn = document.createElement("button");
    btn.textContent = `→ ${node.question}`;
    btn.onclick = () => loadNode(key);
    resultsDiv.appendChild(btn);
  });
}
