import axios from "axios";

// Helper to set cookie
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name +
    "=" +
    (value || "") +
    expires +
    "; path=/; SameSite=Lax" +
    (process.env.NODE_ENV === "production" ? "; Secure" : "");
};

// Helper to get cookie
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Generates UUID v4
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getVisitorIdValue = () => {
  return getCookie("aest_vid");
};

export const getVisitorId = () => {
  let vid = getVisitorIdValue();
  if (!vid) {
    vid = generateUUID();
    setCookie("aest_vid", vid, 365); // 1 year
  }
  return vid;
};

export const logSession = async (backendUrl) => {
  try {
    const visitorId = getVisitorId();
    
    // Client-side 30-min gate
    const lastSessionTs = sessionStorage.getItem("aest_last_session_ts");
    const now = Date.now();
    
    if (lastSessionTs && (now - parseInt(lastSessionTs, 10)) < 30 * 60 * 1000) {
      // Less than 30 mins, do not log again
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get("utm_source");
    const medium = urlParams.get("utm_medium");
    const campaign = urlParams.get("utm_campaign");
    const referrer = document.referrer;
    const landingPage = window.location.pathname;

    const payload = {
      visitorId,
      sessionId: generateUUID(), // unique session id per log
      source,
      medium,
      campaign,
      referrer,
      landingPage,
    };

    // Fire and forget
    axios.post(`${backendUrl}/api/session/log`, payload).catch((err) => {
      console.error("Failed to log session:", err);
    });

    sessionStorage.setItem("aest_last_session_ts", now.toString());
  } catch (error) {
    console.error("Error in session tracking:", error);
  }
};
