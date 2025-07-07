import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div>
      <div className="inline-flex gap-2 items-center mb-3">
        <p className="text-red-600">
          {text1} <span className="text-[#691110] font-medium">{text2}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default Title;
