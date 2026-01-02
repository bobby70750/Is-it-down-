const express = require("express");
const cors = require("cors");
const checkUrl = require("./utils/checkUrl");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory history (last 5 checks)
let history = [];

/**
 * POST /check
 * Body: { "url": "https://example.com" }
 */
app.post("/check", async (req, res) => {
  const { url } = req.body;

  // Basic validation
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    new URL(url); // throws if invalid
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const result = await checkUrl(url);

  const record = {
    url,
    ...result,
    checkedAt: new Date().toISOString()
  };

  // Save history (max 5)
  history.unshift(record);
  history = history.slice(0, 5);

  res.json({
    result: record,
    history
  });
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
