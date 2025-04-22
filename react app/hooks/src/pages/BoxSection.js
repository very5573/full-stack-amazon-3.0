import React from 'react';
import './boxSection.css';

const boxData = [
  {
    title: 'Clothes',
    image: require('../assets/box/box1_image.jpg'),
    link: 'https://www.amazon.in/.../clothes-link'
  },
  {
    title: 'Health & Personal Care',
    image: require('../assets/box/box2_image.jpg'),
    link: 'https://www.amazon.in/.../health-link'
  },
  {
    title: 'Furniture',
    image: require('../assets/box/box3_image.jpg'),
    link: 'https://www.amazon.in/.../furniture-link'
  },
  {
    title: 'Electronics',
    image: require('../assets/box/box4_image.jpg'),
    link: 'https://www.amazon.in/.../electronics-link'
  },
  {
    title: 'Beauty Picks',
    image: require('../assets/box/box5_image.jpg'),
    link: 'https://www.amazon.in/.../beauty-link'
  },
  {
    title: 'Pet Care',
    image: require('../assets/box/box6_image.jpg'),
    link: 'https://www.amazon.in/.../pet-link'
  },
  {
    title: 'New Toys',
    image: require('../assets/box/box7_image.jpg'),
    link: 'https://www.amazon.in/.../toys-link'
  },
  {
    title: 'Fashion Trends',
    image: require('../assets/box/box8_image.jpg'),
    link: 'https://www.amazon.in/.../fashion-link'
  }
];

const BoxSection = () => {
  return (
    <div className="shop-section">
      {boxData.map((box, index) => (
        <div className="box" key={index}>
          
          <div className="box-content">
            <a href={box.link} target="_blank" rel="noopener noreferrer">{box.title}</a>
            <div className="box-img" style={{ backgroundImage: `url(${box.image})` }}></div>
            <p>See more</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoxSection;
//यह लाइन boxData नाम की array को लूप कर रही है। हर एक box के लिए JSX रिटर्न किया जाएगा।

//index एक यूनिक key के रूप में उपयोग हो रहा है, जिससे React को पता चलता है कि कौन-सा एलिमेंट कौन-सा है।

//{boxData.map((box, index) => (
  //यह हर एक बॉक्स के लिए एक div बना रहा है, जिसकी क्लास है box — इसमें एक-एक प्रोडक्ट या आइटम दिखेगा।

//    <div className="box" key={index}>
// <a href={box.link} target="_blank" rel="noopener noreferrer">{box.title}</a>
//यह एक क्लिक करने योग्य लिंक है जो box.link पर लेकर जाएगा।

//target="_blank" मतलब लिंक नई टैब में खुलेगा।

//rel="noopener noreferrer" सुरक्षा के लिए होता है।

//लिंक में जो टेक्स्ट दिखेगा, वो है box.title (जैसे "Electronics", "Books" आदि)।

//<div className="box-img" style={{ backgroundImage: `url(${box.image})` }}></div>
//यह एक div है जिसमें बैकग्राउंड इमेज के तौर पर box.image दिखाया जाता है।

//क्लास box-img का उपयोग इमेज को सही आकार और स्टाइल देने के लिए किया जाता 
