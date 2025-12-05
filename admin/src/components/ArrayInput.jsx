import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const ArrayInput = ({ value = [], onChange, placeholder = "Type and press Enter" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200"
          >
            {item}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <IoClose size={16} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <p className="text-xs text-gray-500">Press Enter to add</p>
    </div>
  );
};

export default ArrayInput;
