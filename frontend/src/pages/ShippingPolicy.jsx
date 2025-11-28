import React from "react";
import Title from "../components/Title";

const ShippingPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-3xl text-center pt-12 pb-4">
          <Title text1="Shipping" text2="Policy" />
        </div>

        <div className="my-12 bg-white rounded-3xl shadow-xl p-8">
          <div className="text-gray-700 space-y-6">
            <div>
              <p className="font-semibold text-xl text-red-800 mb-4">
                Production Timeline
              </p>
              <p className="text-lg leading-relaxed">
                Kindly note that orders take{" "}
                <span className="font-semibold">7-10 working days</span> for
                production.
              </p>
            </div>

            <div>
              <p className="font-semibold text-xl text-red-800 mb-4">
                Shipping Timelines by Region
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    <span className="font-semibold">Lagos Shipping:</span> 1-2
                    working days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    <span className="font-semibold">Interstate Shipping:</span>{" "}
                    3-5 working days via GIG logistics
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    <span className="font-semibold">
                      International Shipping:
                    </span>{" "}
                    7-9 working days via DHL
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-xl text-red-800 mb-4">
                Important Information
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    Shipping costs depend on location and will be generated at
                    checkout.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    Aesthesia is not responsible for custom duties, import
                    taxes, or additional fees imposed by the destination
                    country.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    Once tracking details are provided, we are not liable for
                    delays, lost, or stolen packages but can assist in
                    contacting the courier service.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-800 mr-3 font-bold">•</span>
                  <span>
                    If a delivery is refused by the customer, return charges
                    apply, and store credit will be issued minus the return and
                    original shipping fees.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
              <p className="font-semibold text-pink-900 mb-2">
                International Orders (United States)
              </p>
              <p className="text-gray-700">
                Deliveries to the United States may be subject to additional
                customs duties, import taxes, or fees as determined by the
                destination country. These charges are not covered by Aesthesia
                and are the responsibility of the customer.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-700">
                By shopping with us, you acknowledge and agree to these
                policies. For future assistance, please{" "}
                <span className="font-semibold">
                  <a href="/contact" className="text-red-800 hover:underline">
                    contact us
                  </a>
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
