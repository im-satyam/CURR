const pool = require("../db/connection");
const { fetchQuotes } = require("../services/fetchQuotes");

let cachedData = null;
let lastUpdated = 0;

async function getQuotes(req, res) {
  const now = Date.now();

  if (cachedData && now - lastUpdated < 60000) {
    return res.json(cachedData);
  }

  const currency = process.env.CURRENCY || "ARS";
  const quotes = await fetchQuotes(currency);

  const conn = await pool.getConnection();
  await conn.query("DELETE FROM quotes");
  for (const q of quotes) {
    await conn.query(
      "INSERT INTO quotes (buy_price, sell_price, source) VALUES (?, ?, ?)",
      [q.buy_price, q.sell_price, q.source]
    );
  }
  conn.release();

  cachedData = quotes;
  lastUpdated = now;
  res.json(quotes);
}

async function getAverage(req, res) {
  const [rows] = await pool.query("SELECT * FROM quotes");
  if (!rows.length) return res.status(400).json({ message: "No data" });

  const avgBuy = rows.reduce((sum, q) => sum + q.buy_price, 0) / rows.length;
  const avgSell = rows.reduce((sum, q) => sum + q.sell_price, 0) / rows.length;

  res.json({ average_buy_price: avgBuy, average_sell_price: avgSell });
}

async function getSlippage(req, res) {
  const [rows] = await pool.query("SELECT * FROM quotes");
  if (!rows.length) return res.status(400).json({ message: "No data" });

  const avgBuy = rows.reduce((sum, q) => sum + q.buy_price, 0) / rows.length;
  const avgSell = rows.reduce((sum, q) => sum + q.sell_price, 0) / rows.length;

  const slippage = rows.map((q) => ({
    source: q.source,
    buy_price_slippage: ((q.buy_price - avgBuy) / avgBuy).toFixed(4),
    sell_price_slippage: ((q.sell_price - avgSell) / avgSell).toFixed(4),
  }));

  res.json(slippage);
}

module.exports = { getQuotes, getAverage, getSlippage };
