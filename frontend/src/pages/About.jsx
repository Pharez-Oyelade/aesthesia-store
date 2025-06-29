import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import Newsletter from "../components/NewsletterBox";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div className="">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Consectetur molestiae, accusantium temporibus iusto dicta deleniti
            consequatur labore dolore quod iste minus nam, vitae aspernatur
            quaerat?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            voluptatum temporibus praesentium quos placeat vero, est sint
            eveniet quisquam, odit deleniti reiciendis accusantium maxime. Nulla
            reprehenderit quos quasi aliquam ratione!
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            voluptate non accusamus dolore consequatur eum nobis maxime nam enim
            quod.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
            dolorum officiis, minima assumenda magni ratione labore.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
            dolorum officiis, minima assumenda magni ratione labore.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            nam modi laudantium corrupti sed, eaque tempora accusamus quaerat
            dolorum officiis, minima assumenda magni ratione labore.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
