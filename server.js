import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Game logs endpoint
app.get("/player/:id/:season", async (req, res) => {
  const { id, season } = req.params;

  const url = `https://www.balldontlie.io/api/v1/stats?player_ids[]=${id}&seasons[]=${season}&per_page=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "BallDontLie fetch failed",
      details: err.toString()
    });
  }
});

// Season averages endpoint
app.get("/averages/:id/:season", async (req, res) => {
  const { id, season } = req.params;

  const url = `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${id}&season=${season}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "BallDontLie averages fetch failed",
      details: err.toString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`BallDontLie proxy running on port ${PORT}`);
});
