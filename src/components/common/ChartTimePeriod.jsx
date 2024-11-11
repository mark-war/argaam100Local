const RenderFiscalButton = ({ Label, id, isSelected, onClick, hoverValue }) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`btn dark_text bg-white rounded-3 border_gray btn-sm me-2 fs-10 text_bold   px-2 py-1 ${
          isSelected ? "selected" : ""
        } `}
        type="button"
      >
        {Label}
      </button>
    </>
  );
};

function ChartTimePeriod({
  data,
  labelKey,
  valueKey,
  selected,
  onSelection,
  extraClass,
}) {
  return data.length ? (
    <div
      className={`d-flex justify-content-between align-items-start flex-column ${extraClass}`}
    >
      <div className="d-flex align-items-center float-start my-2-sm">
        {data?.map((item, index) => {
          return (
            // <p>{item[valueKey]}</p>
            selected && (
              <RenderFiscalButton
                key={index}
                Label={item[labelKey]}
                isSelected={item[valueKey] == selected[valueKey]}
                identifier={valueKey}
                onClick={() => onSelection(item)}
              />
            )
          );
        })}
      </div>
    </div>
  ) : null;
}

export default ChartTimePeriod;
