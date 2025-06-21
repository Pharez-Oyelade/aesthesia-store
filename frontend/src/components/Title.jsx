import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div>
      <div className="inline-flex gap-2 items-center mb-3">
        <p className="text-red-500">
          {text1} <span className="text-red-800 font-medium">{text2}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default Title;
