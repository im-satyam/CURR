const axios = require("axios");
const cheerio = require("cheerio");

async function fetchQuotes(currency) {
  let sources = [];

  if (currency === "ARS") {
    sources = [
      "https://www.ambito.com/contenidos/dolar.html",
      "https://www.dolarhoy.com",
      "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB",
    ];
  } else {
    sources = [
      "https://wise.com/es/currency-converter/brl-to-usd-rate",
      "https://nubank.com.br/taxas-conversao/",
      "https://www.nomadglobal.com",
    ];
  }

  // Mock data for now
  const mockQuotes = [
    { buy_price: 5.65, sell_price: 5.75, source: sources[0] },
    { buy_price: 5.60, sell_price: 5.70, source: sources[1] },
    { buy_price: 5.68, sell_price: 5.78, source: sources[2] },
  ];

  return mockQuotes;
}

module.exports = { fetchQuotes };
