import React, { useState } from "react";
import ChartTimePeriod from "../common/ChartTimePeriod";
import CustomEmbed from "../common/CustomEmbed";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import useIsMobile from "../../hooks/useIsMobile";
import getLangID, { getCurrentYear, yearsAgo } from "../../utils/helperFunctions";

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
      key: "id",
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
      key: "id",
      isselected: 3,
    },
    api: "financial-ratio-field",
    params: {
      frids: 110,
      marketid: 3,
      tct: "Bar",
      ic: 0,
    },
  };

  const currentLanguage = useSelector(selectCurrentLanguage);
  const ismobile = useIsMobile();
  const companyid = 43;

  const { Fiscals, Years } = data;
  const [selectedPeriod, setselectedPeriod] = useState(
    Fiscals ? Fiscals.config.find((p) => p.id === Fiscals.isselected) : null
  );
  const [selectedYear, setselectedYear] = useState(
    Years.config.find((p) => p.id === Years.isselected)
  );

  const newQueryParams = new URLSearchParams({
    ...data.params,
    language: getLangID(currentLanguage),
    lang: getLangID(currentLanguage),
    toyear: getCurrentYear(),
    pcompany: companyid,
    fromyear: yearsAgo(selectedYear[Years.key]),
    fiscalperiodtype: selectedPeriod ? selectedPeriod[Fiscals.key] : '',
    companyid: companyid,
    companyids: companyid,
    uid: `4-${companyid}-110-31-0`,
    uidc: `4-${companyid}-110-31-0`,
    ismobile: ismobile ? 1 : 0,
  });

  const chart = `${import.meta.env.VITE_CHARTS_URL}/${
    data.api
  }?${newQueryParams.toString()}`;

  return (
    <div>
      {Fiscals && (
        <>
          <span>Periods</span>
          <ChartTimePeriod
            data={Fiscals.config}
            labelKey={currentLanguage === "ar" ? "na" : "ne"}
            valueKey={Fiscals.key}
            selected={selectedPeriod}
            onSelection={(period) => setselectedPeriod(period)}
          />
        </>
      )}

      <span>Years</span>
      <ChartTimePeriod
        data={Years.config}
        labelKey={currentLanguage === "ar" ? "na" : "ne"}
        valueKey={Years.key}
        selected={selectedYear}
        onSelection={(year) => setselectedYear(year)}
      />

      <CustomEmbed src={chart} />
    </div>
  );
}

