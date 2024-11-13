import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';

const Tooltip = ({ children, tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  const { styles, attributes } = usePopper(iconRef.current, tooltipRef.current, {
    placement: 'right',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'bottom', 'right', 'left'],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          padding: 8,
        },
      },
    ],
  });

  return (
    <div
      ref={iconRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    //   className="textComment_icon"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}

      <div
        ref={tooltipRef}
        style={{
          ...styles.popper,
          zIndex: 10,
          padding: '8px',
          backgroundColor: '#9ac6e6',
          color: 'white',
          borderRadius: '4px',
          visibility: showTooltip ? 'visible' : 'hidden',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 0.2s ease',
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
