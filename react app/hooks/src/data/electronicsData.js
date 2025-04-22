const electronicDeals = [
  {
    id: 101,
    img: require("../assets/electronics/(1).jpg"),
    title: "Sony WH-1000XM5 Headphones",
    price: 29990
  },
  {
    id: 102,
    img: require("../assets/electronics/(2).jpg"),
    title: "Samsung 4K Smart TV 43 Inch",
    price: 38990
  },
  {
    id: 103,
    img: require("../assets/electronics/(3).jpg"),
    title: "Canon EOS M50 Mark II",
    price: 58990
  },
  {
    id: 104,
    img: require("../assets/electronics/(4).jpg"),
    title: "Philips Bluetooth Speaker",
    price: 4490
  },
  // Auto-generated from id 105 to 173
  ...Array.from({ length: 69 }, (_, i) => {
    const id = 105 + i;
    return {
      id,
      img: require(`../assets/electronics/(${i + 5}).jpg`),
      title: `Electronic Product ${id}`,
      price: (Math.floor(Math.random() * 50000) + 1990)
    };
  })
];

export default electronicDeals;
