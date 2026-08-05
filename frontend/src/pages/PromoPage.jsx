import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LuTruck, LuSparkles, LuZap, LuInstagram } from "react-icons/lu";
import { assets } from "../assets/assets";

const PromoPage = () => {
  const { campaignId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(null);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Check localStorage for existing code
  useEffect(() => {
    const cachedCode = localStorage.getItem(`aest_promo_code_${campaignId}`);
    if (cachedCode) {
      setGeneratedCode(cachedCode);
      setSubscribed(true);
    }
  }, [campaignId]);

  // Fetch campaign details
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/campaigns/promo/${campaignId}`,
        );
        if (response.data && response.data.isOpen && response.data.campaign) {
          setCampaign(response.data.campaign);
          setIsOpen(true);
          setRemainingSpots(response.data.remainingSpots);
        } else {
          setIsOpen(false);
        }
      } catch (err) {
        console.error("Error fetching promo:", err);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPromo();
  }, [backendUrl, campaignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/campaigns/promo/${campaignId}/claim`,
        { email },
      );
      if (response.status === 201) {
        setGeneratedCode(response.data.code);
        setSubscribed(true);
        localStorage.setItem(
          `aest_promo_code_${campaignId}`,
          response.data.code,
        );
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setGeneratedCode(err.response.data.code);
        setSubscribed(true);
        localStorage.setItem(
          `aest_promo_code_${campaignId}`,
          err.response.data.code,
        );
      } else if (err.response?.status === 410) {
        setError("This exclusive offer has ended.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // The old full-screen loading and closed states have been moved inside the right panel

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#faf8f6] via-[#f0ece8] to-[#e8e0da] pt-30 pb-6 sm:pb-8 px-4 sm:px-6 relative overflow-hidden">
      <style>{animationStyles}</style>

      {/* Decorative orbs */}
      <div
        className="fixed -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,26,26,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-[100px] -left-[100px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,26,26,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Main Card */}
      <div className="promo-card flex flex-col sm:flex-row w-full max-w-[1000px] sm:min-h-[600px] rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] bg-white mt-2 sm:mt-8">
        {/* Left Visual Panel */}
        <div className="promo-visual shrink-0 w-full sm:w-[48%] relative flex items-end justify-center overflow-hidden min-h-[320px] sm:min-h-0 bg-[#e8e0da]">
          {/* Placeholder Image - UPDATE THIS TO THE REAL PRODUCT IMAGE */}
          <img
            src={assets.haven_img}
            alt="The Haven"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 p-8 sm:p-10 text-left w-full">
            <span className="block text-[10px] tracking-[4px] uppercase text-white/70 mb-3">
              Aesthesia Haven
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-light text-white tracking-tight leading-none mb-4 drop-shadow-lg">
              The Haven
            </h2>
            <div className="w-10 h-[1px] bg-white/40 mb-4" />
            <p className="text-[13px] text-white/80 leading-relaxed max-w-[240px] drop-shadow-md font-medium">
              A piece crafted for those who appreciate comfort and elegance.
            </p>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col justify-center p-7 sm:p-10 lg:p-12 relative overflow-y-auto">
          {loading ? (
            /* ── Loading State ── */
            <div className="flex flex-col items-center justify-center h-full opacity-60 min-h-[300px]">
              <div className="promo-spinner w-8 h-8 border-[2px] border-[rgba(139,26,26,0.12)] border-t-[#8b1a1a] rounded-full mb-4" />
              <p className="text-[13px] text-black/50 tracking-wide">
                Verifying exclusive access...
              </p>
            </div>
          ) : !isOpen && !subscribed ? (
            /* ── Closed / Invalid State ── */
            <div className="text-center promo-fade-in flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-4xl text-black/10 mb-4">
                <LuSparkles />
              </div>
              <h1 className="text-xl font-bold text-[#222] mb-2">
                Offer Unavailable
              </h1>
              <p className="text-[13px] text-black/40 leading-relaxed mb-6 max-w-[280px] mx-auto">
                This exclusive offer is no longer available or has reached its
                limit.
              </p>
              <Link
                to="/"
                className="text-[12px] font-semibold text-[#8b1a1a] no-underline tracking-wide hover:underline"
              >
                ← Back to Shop
              </Link>
            </div>
          ) : subscribed && generatedCode ? (
            /* ── Success State ── */
            <div className="promo-fade-in text-center">
              <div className="promo-success-icon text-5xl text-[#8b1a1a] mb-3 inline-flex justify-center">
                <LuSparkles />
              </div>
              <h2 className="text-[clamp(22px,3vw,28px)] font-bold text-[#111] mb-2 -tracking-wide">
                You're In
              </h2>
              <p className="text-sm text-black/40 mb-6 leading-relaxed">
                Your exclusive access has been granted. Check your inbox for
                confirmation.
              </p>

              {/* Code Card */}
              <div className="relative bg-[rgba(139,26,26,0.04)] border border-[rgba(139,26,26,0.1)] rounded-[14px] p-5 mb-5 overflow-hidden">
                <div className="promo-shimmer absolute inset-0 pointer-events-none" />
                <p className="text-[10px] tracking-[3px] uppercase text-black/30 mb-2.5">
                  Your Personal Code
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="font-mono text-[clamp(17px,3vw,22px)] font-bold text-[#111] tracking-[2px]">
                    {generatedCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className={`promo-btn px-4 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer shrink-0 transition-all duration-200 ${
                      copySuccess
                        ? "bg-green-500/10 border border-green-500/40 text-green-600"
                        : "bg-[rgba(139,26,26,0.9)] border border-[rgba(139,26,26,0.5)] text-white"
                    }`}
                  >
                    {copySuccess ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                {campaign?.discountValue && (
                  <p className="text-xs text-black/30 mt-2.5">
                    {campaign.discountValue}% off — applied at checkout
                  </p>
                )}
              </div>

              {/* Benefit chips */}
              {/* <div className="flex justify-center flex-wrap gap-2 mb-5">
                {campaign?.isDeliveryFree && (
                  <span className="text-[11px] text-black/50 bg-black/[0.03] border border-black/[0.06] rounded-full px-3.5 py-1.5 font-medium flex items-center gap-1.5">
                    <LuTruck size={14} /> Free Delivery
                  </span>
                )}
                <span className="text-[11px] text-black/50 bg-black/[0.03] border border-black/[0.06] rounded-full px-3.5 py-1.5 font-medium flex items-center gap-1.5">
                  <LuSparkles size={14} /> First Batch
                </span>
                <span className="text-[11px] text-black/50 bg-black/[0.03] border border-black/[0.06] rounded-full px-3.5 py-1.5 font-medium flex items-center gap-1.5">
                  <LuZap size={14} /> Priority Access
                </span>
              </div> */}

              {/* Instagram Channel Card */}
              <div className="relative bg-gradient-to-r from-[#fdfbfb] to-[#fbf7f7] border border-[rgba(139,26,26,0.15)] rounded-2xl p-5 mb-6 overflow-hidden group shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="absolute -top-4 -right-4 text-[#8b1a1a] opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
                  <LuInstagram size={140} />
                </div>
                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 sm:flex-row">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-md">
                    <LuInstagram size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-[#111] mb-1.5 tracking-tight">
                      Join the Haven Circle
                    </h3>
                    <p className="text-[13px] text-black/50 leading-relaxed mb-4 max-w-[320px] mx-auto sm:mx-0">
                      Join our exclusive Instagram channel to connect with the
                      community, get early previews of upcoming drops, and never
                      miss an exclusive offer.
                    </p>
                    <a
                      href="https://www.instagram.com/channel/AbZIbbk-9CDGZ5LC/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white border border-black/10 text-[#111] px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-black/20 hover:shadow-sm"
                    >
                      <LuInstagram size={16} className="text-[#e1306c]" />
                      <span>Join Instagram Channel</span>
                    </a>
                  </div>
                </div>
              </div>

              <Link
                to="/product/6a6a48abef6b304775cfc095"
                className="promo-btn block w-full bg-gradient-to-br from-[#8b1a1a] to-[#6b0f0f] text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide "
              >
                Shop The Haven
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <div className="promo-fade-in">
              <span className="block text-[10px] tracking-[4px] uppercase text-[#9b2020] mb-3.5 font-semibold">
                Exclusive Invitation
              </span>
              <h1 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#111] mb-2.5 -tracking-wide leading-tight">
                The Haven
              </h1>
              <p className="text-sm text-black/45 leading-relaxed mb-5 max-w-[380px]">
                You've been invited to get priority access to our newest piece
                before the public launch.
              </p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(139,26,26,0.5)] to-transparent mb-6" />

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-2.5 bg-[rgba(139,26,26,0.05)] border border-[rgba(139,26,26,0.12)] rounded-[10px] px-4 py-2.5 mb-4">
                <span className="text-base font-bold text-[#8b1a1a] tracking-wide">
                  {campaign?.discountValue || 5}% OFF
                </span>
                <span className="text-xs text-black/40 font-medium">
                  Exclusive Discount
                </span>
              </div>

              {/* Remaining spots */}
              {remainingSpots !== null && remainingSpots > 0 && (
                <p className="text-xs text-[rgba(139,26,26,0.7)] mb-4 font-medium">
                  {remainingSpots} spot{remainingSpots !== 1 ? "s" : ""}{" "}
                  remaining
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/[0.06] border border-red-500/25 text-red-700 px-3.5 py-2.5 rounded-lg text-[13px] mb-3.5 leading-normal">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 mb-3"
              >
                <label className="text-[13px] font-semibold text-[#111]">
                  Enter your email
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-[#fafafa] border border-black/30 rounded-xl px-4 py-3.5 text-[#111] text-sm transition-all duration-200 focus:outline-none focus:border-[#8b1a1a] focus:ring-[3px] focus:ring-[rgba(139,26,26,0.12)] placeholder:text-black/40 disabled:opacity-60"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className={`promo-btn w-full bg-gradient-to-br from-[#8b1a1a] to-[#6b0f0f] text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide shadow-[0_4px_24px_rgba(139,26,26,0.3)] transition-all duration-200 ${
                    submitting
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-[0_6px_28px_rgba(139,26,26,0.4)]"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="promo-btn-spinner inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                      Claiming...
                    </span>
                  ) : (
                    "Get My Exclusive Code"
                  )}
                </button>
              </form>

              <p className="text-[12px] text-black/50 text-center mb-6">
                Your email is only used to deliver your code. No spam, ever.
              </p>

              {/* Benefits */}
              <div className="flex flex-col gap-3.5">
                {campaign?.isDeliveryFree && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,26,26,0.06)] flex items-center justify-center text-base shrink-0 text-[#8b1a1a]">
                      <LuTruck size={18} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#222] mb-0.5">
                        Complimentary Doorstep Delivery
                      </p>
                      <p className="text-xs text-black/40 leading-snug">
                        Nationwide delivery at no extra cost
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,26,26,0.06)] flex items-center justify-center text-base shrink-0 text-[#8b1a1a]">
                    <LuSparkles size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#222] mb-0.5">
                      First Production Batch
                    </p>
                    <p className="text-xs text-black/40 leading-snug">
                      Be among the first to own this piece
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,26,26,0.06)] flex items-center justify-center text-base shrink-0 text-[#8b1a1a]">
                    <LuZap size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#222] mb-0.5">
                      Priority Access Before Public Launch
                    </p>
                    <p className="text-xs text-black/40 leading-snug">
                      Shop before anyone else
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brand Footer */}
    </div>
  );
};

// Keyframe animations
const animationStyles = `
  @keyframes promo-fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes promo-success-pop {
    0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); }
  }
  @keyframes promo-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes promo-spin {
    to { transform: rotate(360deg); }
  }

  .promo-card {
    animation: promo-fade-in 0.6s cubic-bezier(0.34, 1.26, 0.64, 1) forwards;
  }
  .promo-fade-in {
    animation: promo-fade-in 0.5s ease forwards;
  }
  .promo-success-icon {
    animation: promo-success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .promo-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(139,26,26,0.05) 50%, transparent 100%);
    background-size: 400px 100%;
    animation: promo-shimmer 2.5s infinite;
  }
  .promo-spinner {
    animation: promo-spin 0.8s linear infinite;
  }
  .promo-btn-spinner {
    animation: promo-spin 0.7s linear infinite;
  }
  .promo-btn {
    position: relative;
    overflow: hidden;
  }
  .promo-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.08);
    transform: translateX(-100%);
    transition: transform 0.35s ease;
  }
  .promo-btn:not(:disabled):hover::after {
    transform: translateX(0);
  }
`;

export default PromoPage;
