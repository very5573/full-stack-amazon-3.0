import React from "react";
import "../style/Footer.css";

function Footer() {
  return (
    <footer>
      <div className="foot-panel1">
        Back to Top
      </div>

      <div className="foot-panel2">
        {Array(4).fill().map((_, i) => (
          <ul key={i}>
            <p>Get to Know Us</p>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">About Amazon</a>
            <a href="#">Investor Relations</a>
            <a href="#">Amazon Devices</a>
            <a href="#">Amazon Science</a>
          </ul>
        ))}
      </div>

      <div className="foot-panel3">
        <div className="logo"></div>
      </div>

      <div className="foot-panel4">
        <div className="pages">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Your Ads Privacy Choices</a>
        </div>
        <div className="copyright">
          © 2003-2025, Tripathi.com, Inc. or its affiliates
        </div>
      </div>
    </footer>
  );
}

export default Footer;


//यह JSX कोड एक लूप को दर्शाता है, जो एक एरे (Array) को चार बार भरता है और फिर प्रत्येक बार एक ul (unordered list) एलिमेंट रेंडर करता है। आइए इसे लाइन-बाय-लाइन समझते हैं:


//{Array(4).fill().map((_, i) => (
//Array(4) एक एरे बनाता है जिसमें 4 undefined वैल्यूज़ होती हैं।

//.fill() का उपयोग करके उस एरे को भर दिया गया है (लेकिन इसे खाली छोड़ दिया गया है, यानी undefined वैल्यूज़ को स्थिर रखता है)।

//map((_, i) => (...) का मतलब है कि map फंक्शन को हर एरे एलिमेंट पर लूप करने के लिए कहा गया है। _ का उपयोग किया गया है क्योंकि हमें एरे के वैल्यूज़ की जरूरत नहीं है, सिर्फ इंडेक्स (i) चाहिए।

//i वह इंडेक्स है (0 से शुरू होने वाला), जो हम लूप के दौरान उपयोग करेंगे।


  //<ul key={i}>
//यह प्रत्येक लूप में एक ul (unordered list) HTML टैग रेंडर करता है।

//key={i} का उपयोग यह सुनिश्चित करने के लिए किया जाता है कि React को यह पता चले कि यह प्रत्येक ul का यूनिक आइडेंटिफायर है (यह महत्वपूर्ण है जब कई एलिमेंट्स को लिस्ट में रेंडर किया जाता है)।

//अगर कोड को पूरा किया जाए, तो यह लूप 4 बार ul एलिमेंट्स रेंडर करेगा। उदाहरण:


//{Array(4).fill().map((_, i) => (
  //<ul key={i}>
   // {/* List items or content will go here *///}
   // </ul>
 // ))}
  //यह कोड 4 ul एलिमेंट्स रेंडर करेगा, हर एक का key उसकी इंडेक्स //वैल्यू ////(i) के हिसाब से होगा।
  
  
  
  
  
  
  
  
  