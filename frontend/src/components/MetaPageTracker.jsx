import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";

const MetaPageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactPixel.pageView();
  }, [location.pathname]);
  return null;
};

export default MetaPageTracker;
