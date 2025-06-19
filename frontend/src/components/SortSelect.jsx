import React from "react";

const SortSelect = ({ sortType, setSortType }) => (
  <select
    className="border-2 border-gray-300 text-sm p-2"
    value={sortType}
    onChange={(e) => setSortType(e.target.value)}
  >
    <option value="relevant">Sort by: Relevant</option>
    <option value="lowest-highest">Sort by: Lowest to Highest</option>
    <option value="highest-lowest">Sort by: Highest to Lowest</option>
  </select>
);

export default SortSelect;
