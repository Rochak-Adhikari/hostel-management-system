import LandingNavbar from "@/components/landing-page/LandingNavbar";
import Hero from "@/components/landing-page/Hero";
import About from "@/components/landing-page/About";
import Features from "@/components/landing-page/Features";
import Testimonials from "@/components/landing-page/Testimonials";
import Gallery from "@/components/landing-page/Gallery";
import FAQ from "@/components/landing-page/FAQ";
import Footer from "@/components/landing-page/Footer";

export default function LandingPage() {
  return (
    <main className="bg-white font-poppins text-black overflow-x-hidden scroll-smooth">
      <LandingNavbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Footer />
    </main>
  );
}