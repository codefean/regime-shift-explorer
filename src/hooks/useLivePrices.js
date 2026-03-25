// hooks/useLivePrices.js
// Fetches real-time quotes from Finnhub for a list of tickers.
// Free tier: 60 calls/min. We batch all tickers for a shift in parallel.
// Sign up at finnhub.io and set VITE_FINNHUB_TOKEN in your .env file.

import { useState, useEffect, useRef } from "react";

const TOKEN = import.meta.env.VITE_FINNHUB_TOKEN;
const BASE = "https://finnhub.io/api/v1";

// Cache across navigations so we don't re-fetch on every back/forward
const priceCache = {};

async function fetchQuote(ticker) {
  if (priceCache[ticker] && Date.now() - priceCache[ticker].ts < 60_000) {
    return priceCache[ticker].data;
  }

  // Finnhub uses plain tickers for US stocks.
  // For international (e.g. ORSTED.CO, NESTE.HE, MOWI.OL) strip the suffix.
  const symbol = ticker.includes(".") ? ticker.split(".")[0] : ticker;

  try {
    const res = await fetch(
      `${BASE}/quote?symbol=${symbol}&token=${TOKEN}`
    );
    const data = await res.json();

    // Finnhub returns { c: current, d: change, dp: changePercent, h, l, o, pc }
    if (!data || data.c === 0) return null;

    const result = {
      current: data.c,
      change: data.d,
      changePct: data.dp,
      high: data.h,
      low: data.l,
      prevClose: data.pc,
    };

    priceCache[ticker] = { data: result, ts: Date.now() };
    return result;
  } catch {
    return null;
  }
}

export function useLivePrices(stocks) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!TOKEN || !stocks?.length) return;

    setLoading(true);

    Promise.all(
      stocks.map(async (s) => {
        const quote = await fetchQuote(s.ticker);
        return [s.ticker, quote];
      })
    ).then((results) => {
      if (!mountedRef.current) return;
      const map = {};
      results.forEach(([ticker, quote]) => {
        map[ticker] = quote;
      });
      setPrices(map);
      setLoading(false);
    });

    return () => { mountedRef.current = false; };
  }, [stocks?.map(s => s.ticker).join(",")]);

  return { prices, loading };
}
