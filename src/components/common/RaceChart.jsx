import { useRef, useState } from "react";
import config from "../../utils/config";
import { LANGUAGEID } from "../../utils/constants/localizedStrings";
import { Table } from "react-bootstrap";
import { strings } from "../../utils/constants/localizedStrings";

const RaceChart = ({ chartData, currentLanguage, direction = "" }) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const iframeRef = useRef(null);

  const handleLoad = () => {
    console.log("The iframe has finished loading");
    setLoading(false); // Set loading to false once the iframe is loaded
  };

  let formattedChartUrl = `${
    config.chartsUrl
  }/race-bar-chart?params=${chartData}&language=${
    LANGUAGEID[currentLanguage.toUpperCase()]
  }`;

  //append ob if available
  formattedChartUrl =
    direction !== ""
      ? formattedChartUrl + `&ob=${direction}`
      : formattedChartUrl;

  return (
    <div className="race_chart_container">
      {loading && <div className="spinner"></div>}
      <Table
        className="table_layout"
        style={{ width: "100%", tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            <th style={{ width: "100px", textAlign: "center" }}>
              {strings.rank}
            </th>
            {/* <th style={{ width: "100%", textAlign: "left" }}></th> */}
          </tr>
        </thead>
        <tbody style={{ marginTop: "0", marginBottom: "0" }}>
          <tr style={{ marginTop: "0", marginBottom: "0" }}>
            <td style={{ width: "10px", textAlign: "center" }}>
              {/* Fixed width for Rank column */}
              {!loading && (
                <div className="rank_column">
                  {/* Static Rank Values */}
                  <span className="bg_tag">1</span>
                  <span className="bg_tag">2</span>
                  <span className="bg_tag">3</span>
                  <span className="bg_tag">4</span>
                  <span className="bg_tag">5</span>
                  <span className="bg_tag">6</span>
                  <span className="bg_tag">7</span>
                  <span className="bg_tag">8</span>
                  <span className="bg_tag">9</span>
                  <span className="bg_tag">10</span>
                </div>
              )}
            </td>
            <td style={{ width: "100%", padding: "0", margin: "0" }}>
              {/* Auto width for Charts column */}
              <div
                className="rank_column"
                style={{ margin: "0", padding: "0" }}
              >
                <embed
                  ref={iframeRef}
                  onLoad={handleLoad}
                  className="race_chart"
                  src={formattedChartUrl}
                  style={{
                    margin: "0",
                    padding: "0",
                    border: "none", // Remove any border
                    display: "block",
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default RaceChart;
