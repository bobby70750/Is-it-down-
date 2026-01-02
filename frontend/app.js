const API_URL = "http://localhost:3000/check";

const input = document.getElementById("urlInput");
const button = document.getElementById("checkBtn");
const resultDiv = document.getElementById("result");
const historyList = document.getElementById("history");

button.addEventListener("click", async () => {
  const url = input.value.trim();
  if (!url) return alert("Enter a URL");

  button.disabled = true;
  button.innerText = "Checking...";
  resultDiv.classList.add("hidden");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    showResult(data.result);
    showHistory(data.history);
  } catch (err) {
    alert("Backend not reachable");
  } finally {
    button.disabled = false;
    button.innerText = "Check";
  }
});

function showResult(result) {
  resultDiv.className = "result";
  resultDiv.classList.add(
    result.status === "UP" ? "up" : "down"
  );

  resultDiv.innerHTML = `
    <strong>${result.status}</strong><br/>
    HTTP Code: ${result.httpCode ?? "N/A"}<br/>
    Response Time: ${result.responseTime} ms
  `;
}

function showHistory(history) {
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.url} — ${item.status} (${item.responseTime} ms)`;
    historyList.appendChild(li);
  });
}
