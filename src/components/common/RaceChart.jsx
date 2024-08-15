import { useRef, useState } from "react";
import config from "../../utils/config";
import { LANGUAGEID } from "../../utils/constants/localizedStrings";

const RaceChart = ({ chartData, currentLanguage }) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const iframeRef = useRef(null);

  const handleLoad = () => {
    console.log("The iframe has finished loading");
    setLoading(false); // Set loading to false once the iframe is loaded
  };

  const formattedChartUrl = `${
    config.chartsUrl
  }/race-bar-chart?params=${chartData}&language=${
    LANGUAGEID[currentLanguage.toUpperCase()]
  }`;

  return (
    <div className="race_chart_container">
      {loading && <div className="spinner"></div>}
      <embed
        ref={iframeRef}
        onLoad={handleLoad}
        className="race_chart"
        src={formattedChartUrl}
      ></embed>
    </div>
  );
};

export default RaceChart;
