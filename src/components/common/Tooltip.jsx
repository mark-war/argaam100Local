import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import { isEmpty } from "../../utils/helperFunctions";

const Tooltip = ({ children, tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  const { styles, attributes } = usePopper(
    iconRef.current,
    tooltipRef.current,
    {
      placement: "right",
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "bottom", "right", "left"],
          },
        },
        {
          name: "preventOverflow",
          options: {
            padding: 8,
          },
        },
      ],
    }
  );

  return (
    <div
      ref={iconRef}
      onMouseEnter={() => (!isEmpty(tooltipText) ? setShowTooltip(true) : null)}
      onMouseLeave={() => setShowTooltip(false)}
      className="textComment_iconPane"
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}

      <div
        ref={tooltipRef}
        style={{
          ...styles.popper,
          zIndex: 10,
          padding: "9px",
          backgroundColor: "#9ac6e6",
          color: "rgba(0, 0, 0, 0.83)",
          fontSize: "13px",
          borderRadius: "4px",
          visibility: showTooltip ? "visible" : "hidden",
          opacity: showTooltip ? 1 : 0,
          transition: "opacity 0.2s ease",
          ...styles.offset,
        }}
        {...attributes.popper}
      >
        {tooltipText}
      </div>
    </div>
  );
};

export default Tooltip;
