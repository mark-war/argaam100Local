import { useState, useEffect } from "react";

export default function useIsMobile(customWidth = 500) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= customWidth);

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= customWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return isMobile;
}
