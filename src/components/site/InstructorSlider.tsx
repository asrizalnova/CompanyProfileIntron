"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

// Import CSS Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type TeamMember = {
  id: number | string;
  name: string;
  role: string | null;
  photoUrl: string | null;
  bio: string | null;
};

export function InstructorSlider({ team }: { team: TeamMember[] }) {
  return (
    <div className="w-full pb-14">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-gray-300 !opacity-100",
          bulletActiveClass: "!bg-[#00AEEF] !w-6 !rounded-full transition-all",
        }}
        navigation={true}
        loop={team.length > 4}
        className="!pb-4"
      >
        {team.map((instructor) => (
          <SwiperSlide key={instructor.id} className="h-auto">
            <div className="group h-full overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100">
              
              {/* Foto Instruktur */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100">
                {instructor.photoUrl ? (
                  <img
                    src={instructor.photoUrl}
                    alt={instructor.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#00AEEF]/10 to-[#39B54A]/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="h-24 w-24 text-[#00AEEF]/30"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info Instruktur */}
              <div className="pt-6 pb-2 px-2">
                <h3 className="text-xl font-bold text-[#1A1A1A] transition-colors group-hover:text-[#00AEEF]">
                  {instructor.name}
                </h3>
                {instructor.role && (
                  <p className="mt-1 text-sm font-bold text-[#E31E24]">
                    {instructor.role}
                  </p>
                )}
                {instructor.bio && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {instructor.bio}
                  </p>
                )}
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}