import React, { useState, useEffect, useRef } from "react";
import bannerImages from "../data/bannerImages";
import "../style/banner.css";

function BannerSlider() {
  //BannerSlider नाम का एक React functional component बनाया गया है।


  const [index, setIndex] = useState(0);
  //एक state बनाई गई है index, जो कि वर्तमान image का index रखती है। शुरू में 0 है।


  const intervalRef = useRef(null);
  ///एक reference बनाया गया है, जिससे हम interval को control (रोक/शुरू) कर सकें।



  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % bannerImages.length);
  };
  //अगले slide पर जाने के लिए function, जो index को एक बढ़ाता है और अंत में वापस 0 कर देता है।




  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };  //पिछले slide पर जाने के लिए function, जो index को घटाता है और अगर पहला slide हो तो आखिरी slide पर ले जाता है।

  // Auto Slide Effect
  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);//जब component लोड हो, तो auto slide चालू हो जाता है। और component हटने पर interval बंद कर देता है।



  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000); // 4 seconds  एक function जो हर 4 सेकंड में image अपने आप बदलता है।

    
    
  };

  const pauseAutoSlide = () => {
    clearInterval(intervalRef.current);
  };
  //एक function जो auto slide को रोकता है (जैसे mouse hover करने पर)।


  //एक div जो पूरा banner slider है, hover करने पर auto slide रुक जाता है और mouse हटाने पर फिर चालू हो जाता है।




  return (
    <div
      className="banner-slider"
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <img src={bannerImages[index]} alt={`Banner ${index + 1}`} className="banner-image" />
      
      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>
    </div>
  );
}
//वर्तमान index के अनुसार image को दिखाता है।



export default BannerSlider;

//const pauseAutoSlide = () => {
 // clearInterval(intervalRef.current);
//};
//एक function जो auto slide को रोकता है (जैसे mouse hover करने पर)।

