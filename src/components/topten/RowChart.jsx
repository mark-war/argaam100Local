import React from "react";

export default function RowChart() {
  const data = {
    Years: {
      config: [
        {
          id: "3",
          na: "3 years",
          ne: "3 years",
        },
        {
          id: "4",
          na: "quarterarabic",
          ne: "quarterenglish",
        },
      ],
      key: "key",
      isselected: 3,
    },
    Fiscals: {
      config: [
        {
          id: "3",
          na: "quarterarabic",
          ne: "quarterenglish",
        },
        {
          id: "4",
          na: "quarterarabic",
          ne: "quarterenglish",
        },
      ],
      key: "key",
      isselected: 3,
    },
    chartsurl: "url",
  };

  const {Fiscals, Years} = data

  return <div>RowChart</div>;
}
