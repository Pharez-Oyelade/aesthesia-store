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

initMetaPixel();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <SpeedInsights />
      <Analytics />
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);
