
import React from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import NewsCarousel from "../components/NewsCarousel";
import SkillsGrid from "../components/SkillsGrid";
import StatCounter from "../components/StatCounter";
import Testimonials from "../components/Testimonials";
import WorksCarousel from "../components/WorksCarousel";
import PortfolioSection from "../components/PortfolioSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <NewsCarousel />
        <SkillsGrid />
        <PortfolioSection key="portfolio-section" />
        <WorksCarousel />
        <StatCounter />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
