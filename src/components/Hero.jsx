import React from "react";
import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img src={logo} alt="ytai_logo" className="w-28 object-contain" />
      </nav>

      <h1 className="head_text">
        Understand YouTube Faster with <br className="max-md:hidden" />
        <span className="orange_gradient">AI-Powered Insights</span>
      </h1>
      <h2 className="desc">
        Convert YouTube videos into clear transcripts or smart summaries using
        GPT-4. Say goodbye to wasting time — just drop a link and get the key
        takeaways instantly.
      </h2>
    </header>
  );
};

export default Hero;
