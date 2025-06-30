// import React from "react";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import Newsletter from "../components/NewsletterBox";
// import NewsletterBox from "../components/NewsletterBox";

// const About = () => {
//   return (
//     <div className="">
//       <div className="text-2xl text-center pt-8 border-t">
//         <Title text1={"ABOUT"} text2={"US"} />
//       </div>

//       <div className="my-10 flex flex-col md:flex-row gap-16">
//         <img
//           src={assets.about_img}
//           className="w-full md:max-w-[450px]"
//           alt=""
//         />
//         <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
//           <p>
//             Lorem ipsum dolor, sit amet consectetur adipisicing elit.
//             Consectetur molestiae, accusantium temporibus iusto dicta deleniti
//             consequatur labore dolore quod iste minus nam, vitae aspernatur
//             quaerat?
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
//             voluptatum temporibus praesentium quos placeat vero, est sint
//             eveniet quisquam, odit deleniti reiciendis accusantium maxime. Nulla
//             reprehenderit quos quasi aliquam ratione!
//           </p>
//           <b className="text-gray-800">Our Mission</b>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
//             voluptate non accusamus dolore consequatur eum nobis maxime nam enim
//             quod.
//           </p>
//         </div>
//       </div>
//       <div className="text-xl py-4">
//         <Title text1={"WHY"} text2={"CHOOSE US"} />
//       </div>

//       <div className="flex flex-col md:flex-row text-sm mb-20">
//         <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
//           <b>Quality Assurance:</b>
//           <p className="text-gray-600">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
//             nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
//             dolorum officiis, minima assumenda magni ratione labore.
//           </p>
//         </div>
//         <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
//           <b>Convenience:</b>
//           <p className="text-gray-600">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
//             nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
//             dolorum officiis, minima assumenda magni ratione labore.
//           </p>
//         </div>
//         <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
//           <b>Exceptional Customer Service:</b>
//           <p className="text-gray-600">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
//             nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
//             dolorum officiis, minima assumenda magni ratione labore.
//           </p>
//         </div>
//       </div>

//       <NewsletterBox />
//     </div>
//   );
// };

// export default About;

import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Banner from "../components/Banner";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
      {/* Optional: Use Banner for a hero effect */}
      <Banner />

      <div className="max-w-5xl mx-auto px-4">
        {/* <div className="text-3xl text-center pt-12 pb-4">
          <Title text1={"ABOUT"} text2={"US"} />
        </div> */}

        <div className="my-12 flex flex-col md:flex-row gap-12 items-center bg-white rounded-3xl shadow-xl p-8">
          <img
            src={assets.about_img}
            className="w-full md:max-w-[400px] rounded-2xl shadow-md object-cover"
            alt="About"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-700">
            <p className="text-lg leading-relaxed">
              Welcome to{" "}
              <span className="font-bold text-red-700">Aesthesia</span>, where
              modern elegance meets timeless classics. Our passion is to help
              you express your unique style with confidence and grace. Every
              piece in our collection is thoughtfully curated to inspire and
              empower you, no matter the occasion.
            </p>
            <p className="text-lg leading-relaxed">
              From luxurious fabrics to exquisite craftsmanship, we believe in
              quality and authenticity. Our journey is driven by a love for
              fashion, a commitment to sustainability, and a desire to make
              every customer feel special.
            </p>
            <div>
              <b className="text-xl text-gray-900 block mb-2">Our Mission</b>
              <p className="text-base text-gray-600">
                To redefine beauty and style by offering exceptional products
                and experiences that celebrate individuality, creativity, and
                confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="text-2xl text-center py-8">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-20">
          <div className="flex-1 bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 items-center border-t-4 border-red-700">
            <b className="text-lg text-red-700">Quality Assurance</b>
            <p className="text-gray-600 text-base text-center">
              We are committed to delivering only the finest products, crafted
              with care and attention to detail. Every item is carefully
              inspected to ensure it meets our high standards.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 items-center border-t-4 border-pink-600">
            <b className="text-lg text-pink-600">Convenience</b>
            <p className="text-gray-600 text-base text-center">
              Enjoy a seamless shopping experience with fast shipping, easy
              returns, and responsive support. Shop from anywhere, anytime, and
              let us handle the rest.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 items-center border-t-4 border-green-600">
            <b className="text-lg text-green-600">Exceptional Service</b>
            <p className="text-gray-600 text-base text-center">
              Our team is dedicated to your satisfaction. We listen, we care,
              and we go the extra mile to ensure you feel valued and supported
              every step of the way.
            </p>
          </div>
        </div>

        <div className="my-12 pb-10">
          <NewsletterBox />
        </div>
      </div>
    </div>
  );
};

export default About;
