"use client";

import Link from "next/link";

// Hardcoded room data - không cần kết nối database
const roomsData = [
  {
    id: "standard",
    type: "Standard Room",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: "Enjoy modern amenities including a king-size bed, smart TV, and complimentary breakfast for two.",
  },
  {
    id: "economy",
    type: "Economy Room",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: "Enjoy modern amenities including a king-size bed, smart TV, and complimentary breakfast for two.",
  },
  {
    id: "family",
    type: "Family Room",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: "Enjoy modern amenities including a king-size bed, smart TV, and complimentary breakfast for two.",
  },
];

// Hardcoded facilities data
const facilitiesData = [
  {
    title: "Best Food",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "Support",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: "Service",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Exotic",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <h1 
            className="text-6xl md:text-8xl mb-6 text-white font-great-vibes"
            style={{ fontFamily: 'var(--font-great-vibes)' }}
          >
            Welcome to Anh Dao Hotel
          </h1>
          <p 
            className="text-xl md:text-2xl text-white mb-4 max-w-3xl mx-auto font-inter font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Discover the perfect getaway where comfort meets elegance. Enjoy your
            stay with breathtaking sea views and exceptional hospitality.
          </p>
        </div>
      </section>

      {/* Room & Rates Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Room & Rates
          </h2>
          <p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto font-inter font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Nestled in the heart of the coastal city, Ocean Breeze Hotel offers a harmonious blend of modern comfort and timeless charm. Whether you are traveling for leisure or business, our warm hospitality ensures a memorable stay.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomsData.map((room) => (
              <Link
                key={room.id}
                href={`/booking?room=${room.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Room Image */}
                <div 
                  className="h-64 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${room.image}')`,
                  }}
                ></div>
                
                {/* Room Content */}
                <div className="p-6">
                  <h3 
                    className="text-2xl font-bold mb-4 text-slate-800 underline decoration-2 underline-offset-4"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {room.type}
                  </h3>
                  <p 
                    className="text-gray-600 font-inter font-light leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {room.amenities}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Facilities
          </h2>
          <p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto font-inter font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            From our rooftop infinity pool to our fine-dining restaurant, Ocean Breeze Hotel provides everything you need for an unforgettable experience. Unwind at the spa, work out in the gym, or explore the nearby attractions just steps away.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilitiesData.map((facility, index) => (
              <div key={index} className="text-center">
                {/* Circular Icon with Gradient */}
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-black"
                    style={{
                      background: 'radial-gradient(circle, rgba(229,231,235,1) 0%, rgba(156,163,175,1) 100%)',
                    }}
                  >
                    {facility.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl font-bold mb-3 text-slate-800"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {facility.title}
                </h3>
                
                {/* Testimonial */}
                <p 
                  className="text-gray-600 font-inter font-light leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  One of the best hotel experiences I&apos;ve ever had!
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
