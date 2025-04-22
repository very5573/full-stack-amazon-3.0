import React from "react";
import BannerSlider from "../pages/BannerSlider";
import BoxSection from '../pages/BoxSection';

import Footer from "../pages/Footer"; // path adjust karo accordingly

function Home() {
  return (
    <div>
      <BannerSlider />
      {/* baaki home ka content yahan */}
      <BoxSection />
      <Footer />


    </div>
  );
}

export default Home;
