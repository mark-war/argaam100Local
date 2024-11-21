import React, { useEffect, useState } from "react";
import { getTotalReturns } from "../../services/screenerApi";
import { strings } from "../../utils/constants/localizedStrings";
import Tooltip from "./Tooltip";

const getCommaSeperatedWithNoDecimal = (num) =>
  parseFloat(parseFloat(num).toFixed(0)).toLocaleString();

export default function TotalReturn({ params }) {
  const [overViewData, setoverViewData] = useState(null);

  useEffect(() => {
    getTotalReturns(params)
      .then((response) => {
        if (response.data.length) {
          setoverViewData(response.data[0]?.overview);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className=" my-3 justify-content-center history_legend totalCompany">
      <div className=" dark_text px-2 border-start b1">
        <span className="fs-11 text_semibold mb-2 d-block">
          {strings.capitalreturn}
        </span>

        <h6 className="text_bold m-0">
          <b>
            {overViewData?.capitalAppreciation
              ? `${getCommaSeperatedWithNoDecimal(
                  overViewData?.capitalAppreciation
                )}%`
              : "ND"}
          </b>

          <Tooltip tooltipText={strings.companyreturntooltip1}>
            <i className={"textComment_icon"}></i>
          </Tooltip>
        </h6>
      </div>

      <div className="dark_text px-2 border-start b3">
        <span className="fs-11 text_semibold mb-2 d-block">
          {strings.totalreturn}
        </span>

        <h6 className="text_bold m-0 orange_text">
          <b>
            {" "}
            {overViewData?.totalReturn
              ? `${getCommaSeperatedWithNoDecimal(overViewData?.totalReturn)}%`
              : "ND"}
          </b>
          <Tooltip tooltipText={strings.companyreturntooltip2}>
            <i className={"textComment_icon"}></i>
          </Tooltip>
        </h6>
      </div>
      <div className="dark_text px-2 border-start b2">
        <span className="fs-11 text_semibold mb-2 d-block">
          {strings.totalreturnreinvestment}
        </span>

        <h6 className="text_bold m-0 orange_text">
          {overViewData?.totalReturnIncludingDividendReinvestment
            ? `${getCommaSeperatedWithNoDecimal(
                overViewData?.totalReturnIncludingDividendReinvestment
              )}%`
            : "ND"}
          <Tooltip tooltipText={strings.companyreturntooltip3}>
            <i className={"textComment_icon"}></i>
          </Tooltip>
        </h6>
      </div>
    </div>
  );
}
