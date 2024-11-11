import React, { useState } from "react";
import ChartTimePeriod from "../common/ChartTimePeriod";
import CustomEmbed from "../common/CustomEmbed";

export default function RowChart() {
  const data = {
    Years: {
      config: [
        {
          id: 3,
          na: "3 years",
          ne: "3 years",
        },
        {
          id: 4,
          na: "4 years",
          ne: "4 years",
        },
      ],
      key: "key",
      isselected: 3,
    },
    Fiscals: {
      config: [
        {
          id: 3,
          na: "quarterarabic",
          ne: "period1",
        },
        {
          id: 4,
          na: "quarterarabic",
          ne: "period2",
        },
      ],
      key: "key",
      isselected: 3,
    },
    chartsurl:
      "https://chartsqa.edanat.com/charts/fr-field-daily-data?frids=36&companyids=43&marketid=3&ct=dline&language=2&lang=2&toyear=2024&pcompany=43&fromyear=2014&fiscalperiodtype=6&companyid=43&tct=Bar&uid=4-43-36-46-0&uidc=4-43-36-46-0&ismobile=0&ic=0",
  };

  const { Fiscals, Years } = data;
  const [selectedPeriod, setselectedPeriod] = useState(
    Fiscals.config.find((p) => p.id === Fiscals.isselected)
  );
  const [selectedYear, setselectedYear] = useState(
    Years.config.find((p) => p.id === Years.isselected)
  );

  return (
    <div>
      <h6>RowChart</h6>

      <span>Periods</span>
      <ChartTimePeriod
        data={Fiscals.config}
        labelKey={"ne"}
        valueKey={"id"}
        selected={selectedPeriod}
        onSelection={(period) => setselectedPeriod(period)}
      />

      <span>Years</span>
      <ChartTimePeriod
        data={Years.config}
        labelKey={"ne"}
        valueKey={"id"}
        selected={selectedYear}
        onSelection={(year) => setselectedYear(period)}
      />

      <CustomEmbed src={data.chartsurl} />
    </div>
  );
}
