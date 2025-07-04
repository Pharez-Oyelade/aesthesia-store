import { useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Banner from "../components/Banner";
import { useLocation } from "react-router-dom";

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behaviour: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
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

        <section id="our-story">
          <div className="text-2xl text-center py-8">
            <Title text1={"OUR"} text2={"STORY"} />
          </div>

          <div>
            <p>
              Aesthesia was born from a simple idea: to make every person feel
              beautiful, confident, and seen. Our founders, inspired by the
              vibrant cultures and timeless elegance found across the globe, set
              out to create a brand that blends modern trends with classic
              sophistication.
              <br />
              <br />
              What started as a small boutique has grown into a thriving
              community of style enthusiasts and creators. We believe that
              fashion is more than just clothing—it's a form of self-expression
              and empowerment. Every collection is thoughtfully curated, every
              product carefully crafted, and every customer treated like family.
              <br />
              <br />
              Our journey has been filled with challenges, creativity, and
              countless moments of joy. We are grateful for the trust and
              support of our customers, and we remain committed to delivering
              exceptional quality, innovative designs, and a shopping experience
              that delights at every step.
              <br />
              <br />
              Join us as we continue to write our story—one of passion, purpose,
              and the pursuit of beauty in all its forms.
            </p>
          </div>
        </section>

        <div className="text-2xl text-center py-8">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-20" id="why-choose">
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

        <section id="faqs">
          <div className="text-2xl text-center py-8">
            <Title text2={"FAQS"} />
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-red-700 mb-2">
                What is Aesthesia’s return policy?
              </h4>
              <p className="text-gray-600">
                We offer hassle-free returns within 14 days of delivery. Items
                must be unused, in original packaging, and accompanied by a
                receipt. Please contact our support team to initiate a return.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-pink-600 mb-2">
                How long does shipping take?
              </h4>
              <p className="text-gray-600">
                Standard shipping typically takes 3-7 business days, depending
                on your location. Express options are available at checkout for
                faster delivery.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-green-600 mb-2">
                Can I track my order?
              </h4>
              <p className="text-gray-600">
                Yes! Once your order is shipped, you’ll receive a tracking
                number via email. You can also view your order status in your
                account dashboard.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-blue-700 mb-2">
                Do you offer international shipping?
              </h4>
              <p className="text-gray-600">
                Absolutely! We ship worldwide. Shipping fees and delivery times
                vary by destination and will be calculated at checkout.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-purple-700 mb-2">
                How can I contact customer support?
              </h4>
              <p className="text-gray-600">
                You can reach us via our contact form, email
                (support@aesthesia.com), or by phone. Our team is available
                Monday to Friday, 9am-6pm.
              </p>
            </div>
          </div>
        </section>

        <div className="my-12 pb-10">
          <NewsletterBox />
        </div>
      </div>
    </div>
  );
};

export default About;
