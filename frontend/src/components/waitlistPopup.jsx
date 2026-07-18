import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const WaitlistPopup = () => {
  const { campaign, showPopup, setShowPopup, subscribeToWaitlist } =
    useContext(shopContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in when popup opens
  useEffect(() => {
    if (showPopup) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [showPopup]);

  // Close popup and store dismissed in local storage
  const closePopup = () => {
    setVisible(false);
    setTimeout(() => {
      localStorage.setItem("aest_waitlist_dismissed", "true");
      setShowPopup(false);
      setEmail("");
      setSubscribed(false);
      setGeneratedCode("");
      setError("");
    }, 300);
  };

  // Show popup after 5 seconds if campaign exists
  useEffect(() => {
    const dismissed = localStorage.getItem("aest_waitlist_dismissed");
    const cachedCode = localStorage.getItem("aest_waitlist_code");

    if (campaign && !dismissed && !cachedCode) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [campaign, setShowPopup]);

  // Handle Escape key to close popup
  useEffect(() => {
    if (!showPopup) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await subscribeToWaitlist(campaign._id, email);
      setGeneratedCode(response.code);
      setSubscribed(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          "This email is already subscribed. Your code is: " +
            err.response.data.code,
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!showPopup) return null;

  return (
    <>
      <style>{`
        @keyframes popup-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popup-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes success-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .waitlist-overlay {
          animation: popup-fade-in 0.3s ease forwards;
        }
        .waitlist-overlay.exiting {
          animation: popup-fade-in 0.3s ease reverse forwards;
        }
        .waitlist-card {
          animation: popup-slide-up 0.35s cubic-bezier(0.34, 1.26, 0.64, 1) forwards;
        }
        .waitlist-card.exiting {
          animation: popup-slide-up 0.25s ease reverse forwards;
        }
        .success-icon {
          animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .code-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(139,26,26,0.06) 50%,
            transparent 100%
          );
          background-size: 400px 100%;
          animation: shimmer 2.5s infinite;
        }
        .waitlist-input:focus {
          outline: none;
          border-color: #8b1a1a;
          box-shadow: 0 0 0 3px rgba(139, 26, 26, 0.15);
        }
        .waitlist-btn {
          position: relative;
          overflow: hidden;
        }
        .waitlist-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-100%);
          transition: transform 0.35s ease;
        }
        .waitlist-btn:not(:disabled):hover::after {
          transform: translateX(0);
        }
        .close-btn {
          transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .close-btn:hover {
          transform: rotate(90deg);
          color: #8b1a1a;
          background: rgba(139, 26, 26, 0.07);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`waitlist-overlay${!visible ? " exiting" : ""}`}
        onClick={closePopup}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Card */}
        <div
          className={`waitlist-card${!visible ? " exiting" : ""}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            maxWidth: "780px",
            minHeight: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.07)",
            background: "#ffffff",
          }}
        >
          {/* ── Left: editorial image (hidden on small screens) ── */}
          <div
            style={{
              flexShrink: 0,
              width: "42%",
              position: "relative",
              display: "none",
            }}
            className="waitlist-image-col"
          >
            <img
              src={assets.waitlist_bg}
              alt="Aesthesia collection"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
            {/* Gradient overlay on image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, transparent 55%, #ffffff 100%)",
              }}
            />
            {/* Brand label on image */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "20px",
                right: "20px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "10px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "'Outfit', sans-serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                Aesthesia Haven
              </span>
            </div>
          </div>

          {/* ── Right: form panel ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(28px, 5vw, 52px)",
              position: "relative",
            }}
          >
            {/* Decorative top-right orb */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(139,26,26,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Close button */}
            <button
              onClick={closePopup}
              aria-label="Close waitlist popup"
              className="close-btn"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "rgba(0,0,0,0.04)",
                color: "rgba(0,0,0,0.4)",
                fontSize: "18px",
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* ── Success state ── */}
            {subscribed && generatedCode ? (
              <div style={{ textAlign: "center" }}>
                <div
                  className="success-icon"
                  style={{ fontSize: "52px", marginBottom: "12px" }}
                >
                  🎉
                </div>
                <h2
                  style={{
                    fontSize: "clamp(20px, 3vw, 26px)",
                    fontWeight: 700,
                    color: "#111",
                    marginBottom: "8px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  You&apos;re In!
                </h2>
                <p
                  style={{
                    color: "rgba(0,0,0,0.45)",
                    fontSize: "14px",
                    marginBottom: "28px",
                    lineHeight: 1.6,
                  }}
                >
                  Check your inbox — a special welcome is on its way.
                </p>

                {/* Discount code card */}
                <div
                  style={{
                    background: "rgba(139,26,26,0.04)",
                    border: "1px solid rgba(139,26,26,0.12)",
                    borderRadius: "14px",
                    padding: "20px",
                    marginBottom: "24px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="code-shimmer"
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "11px",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: "rgba(0,0,0,0.35)",
                      marginBottom: "10px",
                    }}
                  >
                    Your Exclusive Code
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "clamp(16px, 3vw, 22px)",
                        fontWeight: 700,
                        color: "#111",
                        letterSpacing: "2px",
                      }}
                    >
                      {generatedCode}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="waitlist-btn"
                      style={{
                        background: copySuccess
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(139,26,26,0.9)",
                        border: copySuccess
                          ? "1px solid rgba(34,197,94,0.4)"
                          : "1px solid rgba(139,26,26,0.6)",
                        color: copySuccess ? "#4ade80" : "#fff",
                        padding: "7px 18px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition:
                          "background 0.25s, color 0.25s, border 0.25s",
                        flexShrink: 0,
                      }}
                    >
                      {copySuccess ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  {campaign?.discountValue && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(0,0,0,0.35)",
                        marginTop: "10px",
                      }}
                    >
                      {campaign.discountValue}% off — applied at checkout
                    </p>
                  )}
                </div>

                <button
                  onClick={closePopup}
                  className="waitlist-btn"
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #8b1a1a 0%, #6b0f0f 100%)",
                    border: "none",
                    color: "#fff",
                    padding: "13px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(139,26,26,0.35)",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <div>
                {/* Eyebrow label */}
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    color: "#9b2020",
                    marginBottom: "12px",
                    fontWeight: 600,
                  }}
                >
                  Exclusive Access
                </p>

                <h2
                  style={{
                    fontSize: "clamp(22px, 3.5vw, 30px)",
                    fontWeight: 700,
                    color: "#111",
                    marginBottom: "10px",
                    lineHeight: 1.2,
                    letterSpacing: "-0.4px",
                  }}
                >
                  {campaign?.title || "Special Offer"}
                </h2>

                <p
                  style={{
                    color: "rgba(0,0,0,0.45)",
                    fontSize: "14px",
                    lineHeight: 1.65,
                    marginBottom: "28px",
                  }}
                >
                  {campaign?.description ||
                    "Join our waitlist for exclusive first-access and a personal discount code."}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(to right, rgba(139,26,26,0.6), transparent)",
                    marginBottom: "28px",
                  }}
                />

                {/* Error message */}
                {error && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#b91c1c",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      marginBottom: "16px",
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div style={{ position: "relative", marginBottom: "12px" }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="waitlist-input"
                      aria-label="Email address"
                      style={{
                        width: "100%",
                        background: "#fafafa",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "10px",
                        padding: "13px 16px",
                        color: "#111",
                        fontSize: "14px",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="waitlist-btn"
                    style={{
                      width: "100%",
                      background: loading
                        ? "rgba(139,26,26,0.5)"
                        : "linear-gradient(135deg, #8b1a1a 0%, #6b0f0f 100%)",
                      border: "none",
                      color: "#fff",
                      padding: "13px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      transition: "opacity 0.2s, background 0.2s",
                      boxShadow: loading
                        ? "none"
                        : "0 4px 20px rgba(139,26,26,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            display: "inline-block",
                            width: "14px",
                            height: "14px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        Joining…
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </button>
                </form>

                <p
                  style={{
                    color: "rgba(0,0,0,0.9)",
                    fontSize: "11px",
                    textAlign: "center",
                    marginTop: "14px",
                  }}
                >
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive & spinner styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Show image column on wider screens */
        @media (min-width: 560px) {
          .waitlist-image-col {
            display: block !important;
          }
        }

        /* Placeholder colour inside the light input */
        .waitlist-input::placeholder {
          color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
};

export default WaitlistPopup;
