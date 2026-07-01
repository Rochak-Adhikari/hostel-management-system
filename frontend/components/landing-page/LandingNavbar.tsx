"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black h-16">
        <div className="h-full w-full flex items-center justify-between px-5 lg:px-10">

          {/* Logo */}
          <Link href="#top" className="flex items-center">
            <Image
              src="/HostelHubLOGO-removebg-preview.png"
              alt="HostelHub Logo"
              width={72}
              height={72}
              className="object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">

            <Link
              href="#top"
              className="font-semibold hover:opacity-70 transition"
            >
              Home
            </Link>

            <Link
              href="#about"
              className="font-semibold hover:opacity-70 transition"
            >
              About
            </Link>

            <Link
              href="#features"
              className="font-semibold hover:opacity-70 transition"
            >
              Features
            </Link>

            <Link
              href="#facilities"
              className="font-semibold hover:opacity-70 transition"
            >
              Facilities
            </Link>

            <Link
              href="#contact"
              className="font-semibold hover:opacity-70 transition"
            >
              Contact
            </Link>

          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">

            <Link
              href="/login"
              className="px-6 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition"
            >
              Sign Up
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 w-full bg-white border-b border-black z-40 transition-all duration-300 md:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 gap-5">

          <Link href="#top" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="#about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </Link>

          <Link href="#facilities" onClick={() => setMenuOpen(false)}>
            Facilities
          </Link>

          <Link href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <hr />

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="border border-black rounded-md py-3 text-center"
          >
            Log In
          </Link>

          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-black text-white rounded-md py-3 text-center"
          >
            Sign Up
          </Link>

        </div>
      </div>
    </>
  );
}