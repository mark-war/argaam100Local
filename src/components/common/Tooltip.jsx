import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import { isEmpty } from "../../utils/helperFunctions";

const Tooltip = ({ children, tooltipText, tooltipCustomPlacement }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  let flipModifier = {};
  if(tooltipCustomPlacement && tooltipCustomPlacement != ""){
    flipModifier =  {
      name: "flip", //-- Disable flip modifier
      enabled: false, //-- Set to false to disable automatic flipping
    }
  }

  const { styles, attributes } = usePopper(
    iconRef.current,
    tooltipRef.current,
    {
      placement:  tooltipCustomPlacement ?? 'left',
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "bottom"],
          },
        },
        {
          name: "preventOverflow",
          options: {
            padding: 8,
          },
        },

        flipModifier

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
        data-popper-placement={tooltipCustomPlacement ?? 'left'} 
      >
        {tooltipText}
      </div>
    </div>
  );
};

export default Tooltip;
