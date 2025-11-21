"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { removeToken, getToken } from "@/lib/auth";
import { authAPI } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          removeToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Get hero section element
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + 100; // Add some offset for smooth transition
        
        // Check if scrolled past hero section
        setIsScrolled(scrollPosition > heroBottom);
      } else {
        // If hero section not found, use scroll position
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Check on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter rooms
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md text-white shadow-lg transition-all duration-300 ${
        isScrolled 
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" 
          : "bg-blue-500/20"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link 
            href="/" 
            className={`text-2xl font-playfair italic font-normal tracking-wide transition-colors ${
              isScrolled ? "text-white" : "text-gray-200"
            }`}
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            LOGO
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`hover:text-white transition-colors flex items-center gap-2 font-inter font-light ${
                isScrolled ? "text-white" : "text-gray-200"
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              HOME
            </Link>
            <Link
              href="/#about"
              className={`hover:text-white transition-colors font-inter font-light ${
                isScrolled ? "text-white" : "text-gray-200"
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              ABOUT US
            </Link>
            <Link
              href="/#contact"
              className={`hover:text-white transition-colors font-inter font-light ${
                isScrolled ? "text-white" : "text-gray-200"
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              CONTACT
            </Link>
          </div>

          {/* Search Bar and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Searching..."
                  className={`backdrop-blur-sm px-4 py-2 pr-10 rounded-lg w-48 focus:outline-none focus:ring-2 font-inter font-light text-sm transition-colors ${
                    isScrolled 
                      ? "bg-white/20 text-white placeholder-white/70 focus:ring-white/50" 
                      : "bg-gray-500/50 text-gray-200 placeholder-gray-400 focus:ring-gray-400"
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
                <button
                  type="submit"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 hover:text-white transition-colors ${
                    isScrolled ? "text-white/80" : "text-gray-300"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* User Actions */}
            {loading ? (
              <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin transition-colors ${
                isScrolled ? "border-white" : "border-gray-300"
              }`}></div>
            ) : user ? (
              <>
                <Link
                  href="/bookings"
                  className={`hover:text-white transition-colors font-inter font-light hidden md:block ${
                    isScrolled ? "text-white" : "text-gray-200"
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`hover:text-white transition-colors font-inter font-light hidden md:block ${
                      isScrolled ? "text-white" : "text-gray-200"
                    }`}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Admin
                  </Link>
                )}
                <span className={`font-inter font-light hidden md:block transition-colors ${
                  isScrolled ? "text-white" : "text-gray-200"
                }`} style={{ fontFamily: 'var(--font-inter)' }}>
                  {user.full_name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded transition-colors font-inter font-light ${
                    isScrolled 
                      ? "bg-white/20 hover:bg-white/30 text-white" 
                      : "bg-gray-700/50 hover:bg-gray-700/70 text-gray-200"
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hover:text-white transition-colors font-inter font-light hidden md:block ${
                    isScrolled ? "text-white" : "text-gray-200"
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded transition-colors font-inter font-light ${
                    isScrolled 
                      ? "bg-white/20 hover:bg-white/30 text-white" 
                      : "bg-gray-700/50 hover:bg-gray-700/70 text-gray-200"
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  BOOK NOW
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

