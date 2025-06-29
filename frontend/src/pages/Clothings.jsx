import React from "react";
import Banner from "../components/Banner";
import CollectionDisplay from "../components/CollectionDisplay";

const Clothings = () => {
  return (
    <div>
      <Banner />
      <CollectionDisplay section="clothes" />
    </div>
  );
};

export default Clothings;
