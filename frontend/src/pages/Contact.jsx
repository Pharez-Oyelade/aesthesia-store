import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-3xl text-center pt-12 pb-4">
          <Title text1={"CONTACT"} text2={"US"} />
        </div>

        <div className="my-12 flex flex-col md:flex-row gap-12 items-center bg-white rounded-3xl shadow-xl p-8">
          <img
            src={assets.contact_2}
            className="w-full md:max-w-[400px] rounded-2xl shadow-md object-cover"
            alt="Contact"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-700">
            {/* <div>
              <p className="font-semibold text-xl text-red-700 mb-2">
                Aesthesia
              </p>
              <p className="text-gray-600 text-base">
                45678 Filmore Street <br /> Block A2, George, AX
              </p>
            </div> */}
            <div>
              <p className="font-semibold text-xl text-pink-600 mb-2">
                Contact Details
              </p>
              <p className="text-gray-600 text-lg">
                Call: 08065370146 <br /> WhatsApp: 09138720141 <br /> Email:{" "}
                <span className="flex flex-col">
                  aesthesiahaven@gmail.com <span>aesthesiahair@gmail.com</span>
                </span>
              </p>
            </div>

            <div>
              <p>Contact Hours: 9am-5pm</p>
            </div>
            <div>
              <p className="font-semibold text-xl text-green-600 mb-2">
                Socials
              </p>
              <div>
                <p className="flex gap-2 items-center mb-2">
                  <FaFacebookF />
                  <a
                    href="https://www.facebook.com/profile.php?id=61569345876696"
                    className="text-gray-600 text-md"
                  >
                    <span className="underline cursor-pointer">
                      aesthesia_haven
                    </span>
                  </a>
                </p>

                <div className="flex gap-2 items-center mb-4">
                  <FaInstagram />
                  <div className="">
                    <a
                      href="https://www.instagram.com/aesthesia_haven"
                      className="underline"
                    >
                      aesthesia_haven
                    </a>
                    <br />
                    <a
                      href="https://www.instagram.com/aesthesia_hair"
                      className="underline"
                    >
                      aesthesia_hair
                    </a>
                  </div>
                </div>
              </div>
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
