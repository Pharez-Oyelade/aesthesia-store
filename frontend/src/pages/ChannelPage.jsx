import React from "react";
import { LuInstagram } from "react-icons/lu";

const ChannelPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f8f6] p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e6dbce] rounded-full blur-[100px] opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[420px] relative z-10">
        {/* <div className="text-center mb-10">
          <span className="block text-[11px] tracking-[4px] uppercase text-black/40 font-semibold">
            Aesthesia Haven
          </span>
        </div> */}

        {/* Access Card */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[32px] p-8 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] text-center relative overflow-hidden">
          {/* Card subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block text-[10px] tracking-[3px] uppercase text-[#8b1a1a] mb-5 font-bold bg-[#8b1a1a]/5 px-3.5 py-1.5 rounded-full border border-[#8b1a1a]/10">
              Invitation Only
            </span>

            <h1 className="text-[clamp(28px,6vw,36px)] font-bold text-[#111] mb-4 -tracking-wide leading-tight">
              The Inner Circle
            </h1>

            <p className="text-sm text-black/50 leading-relaxed mb-8 max-w-[280px] mx-auto">
              Join our private broadcast channel for priority access and
              unreleased designs before anyone else.
            </p>

            <a
              href="https://www.instagram.com/channel/AbZIbbk-9CDGZ5LC/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#8b1a1a] to-[#6b0f0f] text-white py-4 rounded-2xl text-[15px] font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <LuInstagram size={20} />
              <span>Unlock Access</span>
            </a>

            <p className="text-[11px] text-black/30 mt-5">
              Opens in the Instagram mobile app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
