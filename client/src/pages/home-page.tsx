import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Announcements from "@/components/home/announcements";
import About from "@/components/home/about";
import Events from "@/components/home/events";
import Members from "@/components/home/members";
import Contact from "@/components/home/contact";
import CallToAction from "@/components/home/call-to-action";
import { useEffect } from "react";

const HomePage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Hero />
        <Announcements />
        <About />
        <Events />
        <Members />
        <Contact />
        <CallToAction />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
