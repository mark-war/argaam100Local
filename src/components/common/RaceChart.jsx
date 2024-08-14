import config from "../../utils/config";
import { LANGUAGEID } from "../../utils/constants/localizedStrings";

const RaceChart = ({ chartData, currentLanguage }) => {
  const formattedChartUrl = `${
    config.chartsUrl
  }/race-bar-chart?params=${chartData}&language=${
    LANGUAGEID[currentLanguage.toUpperCase()]
  }`;

  return <embed className="race_chart" src={formattedChartUrl}></embed>;
};

export default RaceChart;
