import express from "express";
import { chromium } from "@playwright/test";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/lebron", async (req, res) => {
  const playerId = 2544;
  const season = req.query.season || "2025-26";

  const url = `https://stats.nba.com/stats/playergamelog?PlayerID=${playerId}&Season=${season}&SeasonType=Regular+Season`;

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    });

    await page.goto(url, { waitUntil: "networkidle" });

    const raw = await page.evaluate(() => document.body.innerText);
    const data = JSON.parse(raw);

    const rows = data.resultSets[0].rowSet;

    const logs = rows.map((g, index) => ({
      game: index + 1,
      date: g[3],
      opponent: g[4],
      home: g[5],
      minutes: g[6],
      points: g[24],
      rebounds: g[18],
      assists: g[19],
      steals: g[20],
      blocks: g[21],
      fgMade: g[10],
      fgAttempted: g[11],
      threeMade: g[12],
      threeAttempted: g[13],
      ftMade: g[14],
      ftAttempted: g[15]
    }));

    res.json({ season, logs });

  } catch (err) {
    res.status(500).json({
      error: "Cloudflare-proof fetch failed",
      details: err.toString()
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Cloudflare proxy running on port ${PORT}`);
});
