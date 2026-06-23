// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "@fontsource/outfit";
// import "@fontsource/prata";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { initMetaPixel } from "./utils/metaPixel.js";

let pixelInitialized = false;
const initPixelOnInteraction = () => {
  if (pixelInitialized) return;
  pixelInitialized = true;
  initMetaPixel();
  ["scroll", "mousemove", "touchstart"].forEach((e) =>
    window.removeEventListener(e, initPixelOnInteraction)
  );
};

["scroll", "mousemove", "touchstart"].forEach((e) =>
  window.addEventListener(e, initPixelOnInteraction, { passive: true })
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <SpeedInsights />
      <Analytics />
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);
