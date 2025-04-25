import React from "react";
import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex flex-col items-center px-4 sm:px-8">
      <nav className="flex justify-center sm:justify-between items-center w-full max-w-7xl mb-10 pt-6">
        <img src={logo} alt="ytai_logo" className="w-24 sm:w-28 object-contain" />
      </nav>


      <h1 className="text-3xl sm:text-5xl font-bold text-center leading-tight mb-4">
        Understand YouTube Faster with <br className="hidden md:inline" />
        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          AI-Powered Insights
        </span>
      </h1>

      <h2 className="text-gray-600 text-base sm:text-lg text-center max-w-2xl">
        Convert YouTube videos into clear transcripts or smart summaries using GPT-4.
        Say goodbye to wasting time — just drop a link and get the key takeaways instantly.
      </h2>
    </header>
  );
};

export default Hero;
