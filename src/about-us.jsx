import { Link } from "react-router-dom";
import {
  LuBriefcase,
  LuAward,
  LuLightbulb,
  LuSmile,
  LuUser,
} from "react-icons/lu";

const About = () => {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-8 lg:px-10 mt-6 sm:mt-10">
        <Link
          className="no-underline text-black hover:text-[#063352] text-sm sm:text-base"
          to="/"
        >
          Home
        </Link>

        <span className="text-gray-500">/</span>

        <p className="text-gray-500 font-medium text-sm sm:text-base">
          About Us
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 px-4 sm:px-8 lg:px-20">
        <div className="flex-1 text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#063352] mb-5 inline-block pb-1">
            MAYUR JEWELS
          </h1>

          <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            <p>
              Established in 1999,{" "}
              <span className="font-bold">Mayur Jewels</span> began with a
              vision to bring the timeless elegance of Indian craftsmanship to
              the heart of the modern wardrobe. What started as a dedicated
              passion for fine artistry has grown into a premier destination for
              traditional{" "}
              <span className="font-bold">
                gold plated jewellery, temple collections, and contemporary
                fashion accessories
              </span>
              .
            </p>

            <p>
              With over <span className="font-bold">25</span> years of
              expertise, our collections are inspired by the majestic beauty of
              the peacock representing royalty, vibrancy, and grace. From grand
              bridal sets to minimalist everyday pieces, each creation is
              meticulously handcrafted.
            </p>

            <p>
              We take immense pride in our{" "}
              <span className="font-bold">
                bespoke jewellery services
              </span>
              , crafting unique designs tailored to your needs and supplying
              premium collections to retail houses across the nation.
            </p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <img
            className="rounded-2xl shadow-xl w-full h-[250px] sm:h-[350px] lg:h-[420px] object-cover"
            src="https://i0.wp.com/promptshelf.in/wp-content/uploads/2025/09/Business-Professional.png?fit=620%2C452&ssl=1"
            alt="Jewellery display"
          />
        </div>
      </div>

      <div className="bg-[#063352]/5 p-5 sm:p-8 lg:p-10 rounded-2xl flex flex-col gap-5 items-start mx-4 sm:mx-8 lg:mx-20">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#063352]">
          Our Mission
        </h1>

        <p className="text-gray-700 leading-relaxed max-w-4xl text-sm sm:text-lg italic">
          "Our mission is to deliver affordable, high quality designer
          jewellery that meets the fashion needs of today’s modern women. At
          Mayur Jewels, every piece is made to make you feel special. Because
          jewellery isn’t just an accessory — it’s an emotion."
        </p>

        <Link
          to="/shop"
          className="bg-[#063352] text-white px-8 sm:px-10 py-3 rounded-lg font-bold hover:bg-[#0a4570] transition-all"
        >
          Shop Now
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-10 border-y border-gray-100 px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col items-center text-center gap-2">
          <LuBriefcase
            size={40}
            className="text-[#063352] sm:w-[45px] sm:h-[45px]"
          />

          <h2 className="text-2xl sm:text-3xl font-bold">2162</h2>

          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Sales Done
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <LuAward
            size={40}
            className="text-[#063352] sm:w-[45px] sm:h-[45px]"
          />

          <h2 className="text-2xl sm:text-3xl font-bold">754</h2>

          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Honors Received
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <LuLightbulb
            size={40}
            className="text-[#063352] sm:w-[45px] sm:h-[45px]"
          />

          <h2 className="text-2xl sm:text-3xl font-bold">435</h2>

          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Unique Designs
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <LuSmile
            size={40}
            className="text-[#063352] sm:w-[45px] sm:h-[45px]"
          />

          <h2 className="text-2xl sm:text-3xl font-bold">1578</h2>

          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Loyal Patrons
          </p>
        </div>
      </div>

      <div className="pb-10 px-4 sm:px-8 lg:px-20">
        <h1 className="text-xl sm:text-2xl font-serif text-[#063352] text-start mb-8 sm:mb-12 uppercase tracking-wide">
          Our Team
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {[
            { name: "Mr. Rajesh Khanna", role: "Founder & CEO" },
            { name: "Ms. Anuradha", role: "Design Head" },
            { name: "Ms. Pranitha", role: "Operations Manager" },
          ].map((member, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 sm:p-8 border border-gray-100 rounded-3xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gray-100 p-6 sm:p-8 rounded-full mb-5 text-[#063352]">
                <LuUser size={50} className="sm:w-[60px] sm:h-[60px]" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                {member.name}
              </h3>

              <p className="text-[#063352] font-medium text-sm sm:text-base text-center">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;