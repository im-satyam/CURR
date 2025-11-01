const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db/connection");
const routes = require("./routes/quotesRouter");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Currency API is running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      buy_price FLOAT,
      sell_price FLOAT,
      source VARCHAR(255)
    )
  `);
});
