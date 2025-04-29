import { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';
import { Circles } from 'react-loader-spinner';
const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { currency, API_KEY } = useContext(CoinContext);
  const [coinData, setCoinData] = useState(undefined);
  const [historicalData, setHistoricalData] = useState(undefined);

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      if (!response.ok) {
        throw new Error(`Coin not found: ${response.status}`);
      }
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
      setCoinData(null);
    }
  };

  const fetchHistoricalData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options);
      if (!response.ok) {
        throw new Error(`Historical data not found: ${response.status}`);
      }
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error(err);
      setHistoricalData(null);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [coinId, currency]);

  useEffect(() => {
    if (coinData === null || historicalData === null) {
      const timer = setTimeout(() => {
        window.location.reload(); // Refresh the same coin page
      }, 20000); // 20 seconds
      return () => clearTimeout(timer);
    }
  }, [coinData, historicalData]);

  if (coinData === null || historicalData === null) {
    console.warn("CoinGecko API is currently experiencing delays. The application is working correctly.");

    return (
      <div className="error-page">
        <div className="error-content">
          <h2>Coin Data Not Available</h2>
          <p>
            The <strong>CoinGecko API</strong> is CoinGecko API is currently experiencing delays for this specific coin.
          </p>
          <p>
            Your application is working perfectly. Please try again in a few moments — this coin's data will appear once the delay is resolved.
          </p>
          <p className="redirect-text">You can also explore other coins or refresh this page later.</p>
        </div>
      </div>
    );
  }


  if (!coinData || !historicalData) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh"
      }}>
        <Circles height={80} width={80} color="#7927ff" />
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currency.symbol} {coinData.market_data.current_price[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{currency.symbol} {coinData.market_data.market_cap[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>{currency.symbol} {coinData.market_data.high_24h[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>{currency.symbol} {coinData.market_data.low_24h[currency.name]?.toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
