import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
const Dashboard = () => {
const [ticker, setTicker] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [error, setError] = useState();
const [loading, setLoading] = useState(false);
const [plot, setPlot] = useState();
const [ma100, setMA100] = useState();
const [ma200, setMA200] = useState();
const [prediction, setPrediction] = useState();
const [mse, setMSE] = useState();
const [rmse, setRMSE] = useState();
const [r2, setR2] = useState();
const [currentPrice, setCurrentPrice] = useState();
const [predictedPrice, setPredictedPrice] = useState();
const [changePercent, setChangePercent] = useState();

useEffect(() => {
const fetchProtectedData = async () => {
try {
const response = await axiosInstance.get("/protected-view/");
} catch (error) {
console.error("Error fetching data:", error);
}
};
fetchProtectedData();
}, []);

const searchStock = async (value) => {
if (value.length < 2) { setSuggestions([]); return; } try { const response=await
  axiosInstance.get(`/search/?q=${value}`); setSuggestions(response.data); } catch (error) { console.error(error); } };
  const handleSubmit=async (e)=> {
  e.preventDefault();
  setLoading(true);
  try {
  const response = await axiosInstance.post("/predict/", {
  ticker: ticker,
  });
  console.log(response.data);
  const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
  const plotUrl = `${backendRoot}${response.data.plot_img}`;
  const ma100Url = `${backendRoot}${response.data.plot_100_dma}`;
  const ma200Url = `${backendRoot}${response.data.plot_200_dma}`;
  const predictionUrl = `${backendRoot}${response.data.plot_prediction}`;
  setPlot(plotUrl);
  setMA100(ma100Url);
  setMA200(ma200Url);
  setPrediction(predictionUrl);
  setMSE(response.data.mse);
  setRMSE(response.data.rmse);
  setR2(response.data.r2);
  setCurrentPrice(response.data.current_price);
  setPredictedPrice(response.data.predicted_price);
  setChangePercent(response.data.change_percent);
  // Set plots
  if (response.data.error) {
  setError(response.data.error);
  }
  } catch (error) {
  console.error("There was an error making the API request", error);
  } finally {
  setLoading(false);
  }
  };

  return (
  <div className="container">
    <div className="row">
      <div className="col-lg-8 col-md-10 mx-auto">
        <div className="prediction-card">
          <h2 className="text-light text-center fw-bold mb-2">
            📈 AI Stock Prediction Portal
          </h2>

          <p className="text-center text-secondary mb-4">
            Predict Indian & US Stocks using Machine Learning
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-group-text bg-dark text-info border-0">
                <FaSearch />
              </span>

              <input type="text" className="form-control search-input"
                placeholder="Search Indian or US Stock (Example: Reliance, TCS, AAPL)" value={ticker} onChange={(e)=> {
              setTicker(e.target.value);
              searchStock(e.target.value);
              }}
              required
              />
            </div>

            {suggestions.length > 0 && (
            <div className="list-group mt-2">
              {suggestions.map((item, index) => (
              <button key={index} type="button" className="list-group-item list-group-item-action" onClick={()=> {
                setTicker(item.symbol);
                setSuggestions([]);
                }}
                >
                {item.name}
              </button>
              ))}
            </div>
            )}
            <small>
              {error && <div className="text-danger">{error}</div>}
            </small>
            <button type="submit" className="btn btn-info predict-btn w-100 mt-4">
              {loading ? (
              <span>
                <FontAwesomeIcon icon={faSpinner} spin /> Analyzing Stock...
              </span>
              ) : (
              <>📈 Predict Stock</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Print prediction plots */}
      {prediction && (
      <>
        <div className="row mt-4">

          <div className="col-md-4 mb-3">

            <div className="card bg-dark text-light border-primary h-100">

              <div className="card-body text-center">

                <h5>💰 Current Price</h5>

                <h3 className="text-info">

                  ₹ {currentPrice}

                </h3>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card bg-dark text-light border-success h-100">

              <div className="card-body text-center">

                <h5>🤖 Predicted Price</h5>

                <h3 className="text-success">

                  ₹ {predictedPrice}

                </h3>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card bg-dark text-light border-warning h-100">

              <div className="card-body text-center">

                <h5>📈 Expected Change</h5>

                <h3 className={changePercent>= 0 ? "text-success" : "text-danger"}
                  >
                  {changePercent >= 0 ? "+" : ""}
                  {changePercent}%
                </h3>

              </div>

            </div>

          </div>

        </div>
        <div className="prediction mt-5">
          <div className="p-3">
           {plot && (<img src={plot} style={{ maxWidth: "100%" }} alt="Stock Plot" />)}
          </div>

          <div className="p-3">
           <img src={ma100} alt="100 DMA" />
          </div>

          <div className="p-3">
            <img src={ma200} alt="200 DMA" />
          </div>

          <div className="p-3">
           {prediction && (<img src={prediction} alt="Prediction" />)}
          </div>

          <div className="row mt-4">

            <div className="col-md-4 mb-3">

              <div className="card bg-dark text-light border-info h-100">

                <div className="card-body text-center">

                  <h5>🎯 Accuracy</h5>

                  <h3 className="text-info">
                    {(r2 * 100).toFixed(2)}%
                  </h3>

                  <small>Model Confidence</small>

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div className="card bg-dark text-light border-warning h-100">

                <div className="card-body text-center">

                  <h5>📉 RMSE</h5>

                  <h3 className="text-warning">
                    {rmse.toFixed(2)}
                  </h3>

                  <small>Prediction Error</small>

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div className="card bg-dark text-light border-success h-100">

                <div className="card-body text-center">

                  <h5>📊 MSE</h5>

                  <h3 className="text-success">
                    {mse.toFixed(2)}
                  </h3>

                  <small>Mean Squared Error</small>

                </div>

              </div>

            </div>

          </div>
        </div>
      </>
      )}
    </div>
  </div>

  );
  };

  export default Dashboard;