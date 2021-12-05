import React from "react";
import Footer from "../components/footer";
import Features from "../components/home/features";
import Hero from "../components/home/hero";

export default function Home() {
  return (
    <React.Fragment>
      <Hero />
      <Features />
      <Footer />
    </React.Fragment>
  );
}
