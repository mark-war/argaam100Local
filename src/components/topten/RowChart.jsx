import React, { useState } from "react";
import ChartTimePeriod from "../common/ChartTimePeriod";
import CustomEmbed from "../common/CustomEmbed";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import useIsMobile from "../../hooks/useIsMobile";
import getLangID, {
  getCurrentYear,
  yearsAgo,
} from "../../utils/helperFunctions";

export default function RowChart({ config, templateID,CompanyID }) {
  const data = JSON.parse(config);

  const currentLanguage = useSelector(selectCurrentLanguage);
  const ismobile = useIsMobile();
  const companyid = CompanyID;
  const uid = `4-${companyid}-${
    data["fs-id-config"]
      ? data["fs-id-config"]?.find((_) => _.templateID == templateID)?.value
      : data["fr-id-config"]
      ? data["fr-id-config"]?.find((_) => _.templateID == templateID)?.value
      : ""
  }-31-0`;

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
    // fromyear: yearsAgo(selectedYear['id']),
    ...(data?.Years && {
      [data?.Years?.key]: yearsAgo(selectedYear["id"]),
    }),
    // fiscalperiodtype: selectedPeriod ? selectedPeriod['id'] : '',
    ...(data?.Fiscals && {
      [data?.Fiscals?.key]: selectedPeriod ? selectedPeriod["id"] : "",
    }),
    companyid: companyid,
    companyids: companyid,
    uid: uid,
    uidc: uid,
    ismobile: ismobile ? 1 : 0,
    ...(data["fs-id-config"] && {
      fstfieldid: data["fs-id-config"]?.find(
        (_) => _.templateID == templateID
      )?.value,
    }),
    ...(data["fr-id-config"] && {
      frids: data["fr-id-config"]?.find((_) => _.templateID == templateID)
        ?.value,
    }),
  });

  const chart = `${import.meta.env.VITE_CHARTS_URL}/${
    data.api
  }?${newQueryParams.toString()}`;

  return (
    <div className="expand_chart">
      <div className="period">
        {Fiscals && (
          <>
            <ChartTimePeriod
              data={Fiscals.config}
              labelKey={currentLanguage === "ar" ? "na" : "ne"}
              valueKey={"id"}
              selected={selectedPeriod}
              onSelection={(period) => setselectedPeriod(period)}
            />
          </>
        )}
      </div>

      <div className="year">
        <ChartTimePeriod
          data={Years.config}
          labelKey={currentLanguage === "ar" ? "na" : "ne"}
          valueKey={"id"}
          selected={selectedYear}
          onSelection={(year) => setselectedYear(year)}
        />
      </div>

      <CustomEmbed src={chart} />
    </div>
  );
}
