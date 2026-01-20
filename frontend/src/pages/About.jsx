import { useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Banner from "../components/Banner";
import { useLocation } from "react-router-dom";
import Policy from "../components/Policy";

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
      {/* <Banner image={assets.about_banner} bannerText="About Us" /> */}

      <div className="max-w-5xl mx-auto px-4">
        <div className="text-3xl text-center pt-12 pb-4">
          <Title text1={"ABOUT"} text2={"US"} />
        </div>

        <div className="my-12 flex justify-center flex-col md:flex-row gap-12 items-center bg-white rounded-3xl shadow-xl p-8">
          {/* <img
            src={assets.bg_1_main}
            className="w-full md:max-w-[400px] rounded-2xl shadow-md object-cover"
            alt="About"
          /> */}
          <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-700">
            <p className="text-lg leading-relaxed">
              There comes a point in every woman’s journey when she realizes
              she’s been living through expectations that were never truly hers.
              Trying to be enough. To look right. To belong. And somewhere along
              the way, she forgets what it feels like to simply be. That’s the
              ache <span className="text-red-800">Aesthesia</span> was born to
              heal. We understand what it’s like to lose sight of your own
              reflection — to wake up one day and realize you’ve been dimming to
              fit into a world that was made brighter by your light. Aesthesia
              is a gentle return — a space where every woman can see herself
              again, in her color, in her confidence, in her truth.
            </p>

            <p className="text-lg">
              We design with feeling — pieces and products that carry softness
              and strength, elegance and ease. Each one made to remind you of
              who you’ve always been beneath the noise. Because beauty isn’t
              about becoming someone new — it’s about coming home to yourself.
            </p>

            <p className="text-lg">
              We began with a simple invitation: Embrace Your Beautiful. And as
              we’ve grown, that truth has deepened — helping women see
              themselves again, in color, in confidence, in becoming.
            </p>

            <p className="italic">
              Aesthesia….Where women see themselves again.
            </p>
          </div>
        </div>

        {/* <section id="our-story">
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
        </section> */}

        <section id="policies">
          <div className="text-2xl text-center py-8">
            <Title text1={"OUR"} text2={"POLICIES"} />
          </div>

          <div>
            <Policy />
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
              produced to ensure it meets our high standards.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 items-center border-t-4 border-pink-600">
            <b className="text-lg text-pink-600">Convenience</b>
            <p className="text-gray-600 text-base text-center">
              Enjoy a seamless shopping experience with fast shipping, and
              responsive support. Shop from anywhere, anytime, and let us handle
              the rest.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 items-center border-t-4 border-green-600">
            <b className="text-lg text-green-600">Exceptional Service</b>
            <p className="text-gray-600 text-base text-center">
              We are dedicated to your satisfaction. We listen, we care, and we
              go the extra mile to ensure you feel valued and supported every
              step of the way.
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
                All Aesthesia Haven pieces are made-to-order and produced only
                after an order is placed.
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>
                  Made-to-order items are non-returnable and non-refundable,
                  whether created using custom measurements or our standard size
                  chart.
                </li>
                <li>
                  Customers are responsible for providing accurate measurements
                  or selecting the correct size from our size guide.
                </li>
                <li>
                  Orders cannot be cancelled, modified, or exchanged once
                  production has begun.
                </li>
                <li>
                  In the rare event of a construction or production error on our
                  part, we will correct the issue at no additional cost.
                </li>
                <li>Sale or discounted items are also non-returnable.</li>
                Customers are responsible for shipping costs unless the item is
                faulty.
              </ul>
              <p className="text-gray-600 mt-5">
                If you experience an issue with your order, please contact us
                within 48 hours of delivery with clear photos and your order
                number.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-lg text-pink-600 mb-2">
                How long does shipping take?
              </h4>
              <p className="text-gray-600">
                Standard shipping typically takes 3-7 business days, depending
                on your location.
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
                You can reach us via email (aesthesiahaven@gmail.com), or by
                phone. Our team is available Monday to Saturday, 9am-6pm.
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
