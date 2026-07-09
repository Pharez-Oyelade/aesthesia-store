import React from "react";
import { showroomAssets } from "../../assets/showroom/showroom";

const ShowroomHero = () => {
  return (
    <div className="w-full h-[85vh] flex justify-center items-center relative group">
      <div className="">
        <h1 className="text-[250px] font-extrabold tracking-wider leading-tight uppercase text-gray-900">
          Àlàáfíà
        </h1>
        <div className="relative">
          <p className="text-2xl pb-5 w-[200px] text-gray-700">
            Ease is her new luxury
          </p>
          <div className="absolute bottom-2 bg-gray-700 w-15 h-0.5"></div>
        </div>
      </div>

      <div className="absolute inset-0 flex justify-center items-center overflow-hidden:">
        <img
          src={showroomAssets.asa_plain}
          alt="ASA Plain"
          className="h-full w-1/2 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default ShowroomHero;
