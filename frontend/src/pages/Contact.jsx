// import React from "react";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import NewsletterBox from "../components/NewsletterBox";

// const Contact = () => {
//   return (
//     <div className="">
//       <div className="text-center text-2xl pt-10 border-t">
//         <Title text1={"CONTACT"} text2={"US"} />
//       </div>

//       <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
//         <img
//           src={assets.contact_img}
//           className="w-full md:max-w-[480px]"
//           alt=""
//         />
//         <div className="flex flex-col justify-center items-start gap-6">
//           <p className="font-semibold text-xl text-gray600">Our Store</p>
//           <p className="text-gray-500">
//             45678 Filmore Street <br /> Block A2, George, AX
//           </p>
//           <p className="text-gray-500">
//             Tel: 7688 4848 848 <br /> Email: tyuoe@aesthesia.com
//           </p>
//           <p className="font-semibold text-xl text-gray-600">
//             Careers at Aesthesia
//           </p>
//           <p className="text-gray-500">
//             Learn more about our teams and job openings
//           </p>
//           <button className="border border-black px-8 py-4 text-sm hover:bg-red-800 hover:text-white transition-all duration-500">
//             Explore
//           </button>
//         </div>
//       </div>

//       <NewsletterBox />
//     </div>
//   );
// };

// export default Contact;

import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-3xl text-center pt-12 pb-4">
          <Title text1={"CONTACT"} text2={"US"} />
        </div>

        <div className="my-12 flex flex-col md:flex-row gap-12 items-center bg-white rounded-3xl shadow-xl p-8">
          <img
            src={assets.contact_img}
            className="w-full md:max-w-[400px] rounded-2xl shadow-md object-cover"
            alt="Contact"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-700">
            <div>
              <p className="font-semibold text-xl text-red-700 mb-2">
                Our Store
              </p>
              <p className="text-gray-600 text-base">
                45678 Filmore Street <br /> Block A2, George, AX
              </p>
            </div>
            <div>
              <p className="font-semibold text-xl text-pink-600 mb-2">
                Contact Details
              </p>
              <p className="text-gray-600 text-base">
                Tel: 7688 4848 848 <br /> Email: tyuoe@aesthesia.com
              </p>
            </div>
            <div>
              <p className="font-semibold text-xl text-green-600 mb-2">
                Careers at Aesthesia
              </p>
              <p className="text-gray-600 text-base mb-4">
                Learn more about our teams and job openings.
              </p>
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-red-700 to-pink-600 hover:from-red-800 hover:to-pink-700 text-white text-base font-bold shadow-lg tracking-wide transition-all duration-300 border-2 border-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300">
                Explore
              </button>
            </div>
          </div>
        </div>

        <div className="my-12 pb-10">
          <NewsletterBox />
        </div>
      </div>
    </div>
  );
};

export default Contact;
