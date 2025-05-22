"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
//import { BiSolidSchool } from "react-icons/bi";

export default function MainPage() {
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full min-h-screen bg-white shadow-lg max-w-xl mx-auto p-4 pt-[70px] pb-[60px]">
      <Navbar />
      {/* Quote Banner */}
      <section className="text-center font-bold text-lg py-4 rounded-md">
        <img
          src="/banner_image/banner.png"
          alt="배너"
          className="w-full h-32 object-cover rounded-md"
        />
      </section>

      {/* Image Slider */}
      <section className="overflow-hidden mt-4 rounded-md">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${imageIndex * 100}%)` }}
        >
          {[
            "/banner_image/banner1.png",
            "/banner_image/banner2.png",
            "/banner_image/banner3.png",
            "/banner_image/banner4.png",
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`강아지${i + 1}`}
              className="w-full h-64 object-cover flex-shrink-0"
            />
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold text-gray-500">Community</h2>
        </div>
        {[
          {
            title: "School Board",
            type: "school",
            img: "/board_img/school.png",
          },
          { title: "Free Board", type: "free", img: "/board_img/free.png" },
          { title: "Club Board", type: "club", img: "/board_img/club.png" },
          {
            title: "Secondhand Marketplace Board",
            type: "secondhand",
            img: "/board_img/market.png",
          },
        ].map((c, i) => (
          <div
            key={i}
            onClick={() => router.push(`/community?type=${c.type}`)}
            className="flex items-center px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
          >
            <div className="w-16 h-16 rounded bg-cover bg-center mr-4 overflow-hidden flex items-center justify-center">
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-yellow-700">community</p>
              <p className="text-md text-gray-600 font-medium">{c.title}</p>
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
