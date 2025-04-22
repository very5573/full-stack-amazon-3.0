const laptopImages = [
  {
    id: 1,
    img: require("../assets/laptops/1.jpg"),
    title: "Dell XPS 13",
    price: 75000,
    description: "A lightweight, powerful laptop with an ultra-thin bezel and amazing performance.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.3\" FHD",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 2,
    img: require("../assets/laptops/2.jpg"),
    title: "MacBook Air M1",
    price: 95000,
    description: "Sleek and portable laptop with Apple's M1 chip, long battery life, and great performance.",
    specifications: {
      processor: "Apple M1",
      ram: "8 GB",
      storage: "256 GB SSD",
      display: "13.3\" Retina",
      graphics: "Apple M1 GPU"
    }
  },
  {
    id: 3,
    img: require("../assets/laptops/3.jpg"),
    title: "HP Spectre x360",
    price: 120000,
    description: "A versatile laptop that turns into a tablet with a 360-degree hinge and powerful Intel i7.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.3\" 4K",
      graphics: "Intel Iris Plus"
    }
  },
  {
    id: 4,
    img: require("../assets/laptops/4.jpg"),
    title: "Lenovo ThinkPad X1",
    price: 110000,
    description: "Business-class laptop with a powerful Intel i7 processor and ultra-durable design.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "1 TB SSD",
      display: "14\" FHD",
      graphics: "Intel UHD Graphics"
    }
  },
  {
    id: 5,
    img: require("../assets/laptops/5.jpg"),
    title: "Asus ZenBook 14",
    price: 85000,
    description: "Ultra-portable laptop with a thin design, Intel i7 processor, and stunning display.",
    specifications: {
      processor: "Intel Core i7",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "14\" FHD",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 6,
    img: require("../assets/laptops/6.jpg"),
    title: "Microsoft Surface Laptop 4",
    price: 98000,
    description: "A premium, elegant laptop with a touch screen and the latest Intel processors.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.5\" PixelSense",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 7,
    img: require("../assets/laptops/7.jpg"),
    title: "Acer Predator Helios 300",
    price: 140000,
    description: "A high-performance gaming laptop with an Nvidia RTX 3070 GPU and 16GB RAM.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "1 TB SSD",
      display: "15.6\" 144Hz FHD",
      graphics: "Nvidia RTX 3070"
    }
  },
  {
    id: 8,
    img: require("../assets/laptops/8.jpg"),
    title: "HP Elite Dragonfly",
    price: 145000,
    description: "Premium business laptop with long battery life and ultra-portable design.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.3\" FHD",
      graphics: "Intel UHD Graphics"
    }
  },
  {
    id: 9,
    img: require("../assets/laptops/9.jpg"),
    title: "Razer Blade 15",
    price: 160000,
    description: "A powerful gaming laptop with high-end graphics and amazing refresh rate display.",
    specifications: {
      processor: "Intel Core i9",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "15.6\" 300Hz FHD",
      graphics: "Nvidia RTX 3080"
    }
  },
  {
    id: 10,
    img: require("../assets/laptops/10.jpg"),
    title: "Dell Inspiron 15",
    price: 65000,
    description: "Reliable everyday laptop with good performance and affordable pricing.",
    specifications: {
      processor: "Intel Core i5",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "15.6\" FHD",
      graphics: "Intel UHD Graphics"
    }
  },
  {
    id: 11,
    img: require("../assets/laptops/11.jpg"),
    title: "MacBook Pro 16",
    price: 180000,
    description: "High-performance laptop for professional users with a stunning 16-inch Retina display.",
    specifications: {
      processor: "Intel Core i9",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "16\" Retina",
      graphics: "AMD Radeon Pro 5500M"
    }
  },
  {
    id: 12,
    img: require("../assets/laptops/12.jpg"),
    title: "Lenovo Legion 5 Pro",
    price: 130000,
    description: "A gaming powerhouse with Nvidia RTX 3060 and a 165Hz display.",
    specifications: {
      processor: "AMD Ryzen 7",
      ram: "16 GB",
      storage: "1 TB SSD",
      display: "15.6\" 165Hz FHD",
      graphics: "Nvidia RTX 3060"
    }
  },
  {
    id: 13,
    img: require("../assets/laptops/13.jpg"),
    title: "MSI GE76 Raider",
    price: 170000,
    description: "An ultimate gaming laptop with Intel i9, RTX 3080, and a massive 17-inch display.",
    specifications: {
      processor: "Intel Core i9",
      ram: "32 GB",
      storage: "2 TB SSD",
      display: "17.3\" 300Hz FHD",
      graphics: "Nvidia RTX 3080"
    }
  },
  {
    id: 14,
    img: require("../assets/laptops/14.jpg"),
    title: "Asus ROG Zephyrus G14",
    price: 155000,
    description: "Compact gaming laptop with AMD Ryzen 9 and Nvidia RTX 3060 graphics.",
    specifications: {
      processor: "AMD Ryzen 9",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "14\" 120Hz FHD",
      graphics: "Nvidia RTX 3060"
    }
  },
  {
    id: 15,
    img: require("../assets/laptops/15.jpg"),
    title: "Samsung Galaxy Book Pro",
    price: 90000,
    description: "A thin and powerful laptop with Intel i7 processor and long battery life.",
    specifications: {
      processor: "Intel Core i7",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "13.3\" AMOLED",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 16,
    img: require("../assets/laptops/16.jpg"),
    title: "HP Omen 15",
    price: 135000,
    description: "A powerful gaming laptop with Intel i7, RTX 3070, and a high-refresh rate display.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "1 TB SSD",
      display: "15.6\" 144Hz FHD",
      graphics: "Nvidia RTX 3070"
    }
  },
  {
    id: 17,
    img: require("../assets/laptops/17.jpg"),
    title: "Acer Swift 3",
    price: 75000,
    description: "Thin and lightweight laptop with AMD Ryzen 5 processor and long battery life.",
    specifications: {
      processor: "AMD Ryzen 5",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "14\" FHD",
      graphics: "AMD Radeon Vega 8"
    }
  },
  {
    id: 18,
    img: require("../assets/laptops/18.jpg"),
    title: "Dell G5 15",
    price: 85000,
    description: "Mid-range gaming laptop with Intel i7 and Nvidia GTX 1660 Ti graphics.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "15.6\" FHD",
      graphics: "Nvidia GTX 1660 Ti"
    }
  },
  {
    id: 19,
    img: require("../assets/laptops/19.jpg"),
    title: "Alienware X17",
    price: 200000,
    description: "High-end gaming laptop with Intel i9, RTX 3080, and a 17-inch display.",
    specifications: {
      processor: "Intel Core i9",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "17.3\" 360Hz FHD",
      graphics: "Nvidia RTX 3080"
    }
  },
  {
    id: 20,
    img: require("../assets/laptops/20.jpg"),
    title: "Huawei MateBook X Pro",
    price: 105000,
    description: "Ultra-thin and powerful laptop with a 3K touchscreen and Intel i7 processor.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.9\" 3K",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 21,
    img: require("../assets/laptops/21.jpg"),
    title: "LG Gram 17",
    price: 120000,
    description: "Lightweight laptop with a huge 17-inch screen and powerful performance.",
    specifications: {
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "1 TB SSD",
      display: "17\" WQXGA",
      graphics: "Intel Iris Xe"
    }
  },
  {
    id: 22,
    img: require("../assets/laptops/22.jpg"),
    title: "Acer Aspire 5",
    price: 45000,
    description: "Affordable everyday laptop with an Intel i5 processor and good all-around performance.",
    specifications: {
      processor: "Intel Core i5",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "15.6\" FHD",
      graphics: "Intel UHD Graphics"
    }
  },
  {
    id: 23,
    img: require("../assets/laptops/23.jpg"),
    title: "Asus VivoBook S15",
    price: 65000,
    description: "Affordable and stylish laptop with a 15.6-inch display and solid performance.",
    specifications: {
      processor: "Intel Core i5",
      ram: "8 GB",
      storage: "512 GB SSD",
      display: "15.6\" FHD",
      graphics: "Intel UHD Graphics"
    }
  },
  {
    id: 24,
    img: require("../assets/laptops/24.jpg"),
    title: "Microsoft Surface Laptop Go",
    price: 60000,
    description: "Compact, lightweight laptop with an Intel i5 processor and 12.4-inch display.",
    specifications: {
      processor: "Intel Core i5",
      ram: "8 GB",
      storage: "256 GB SSD",
      display: "12.4\" PixelSense",
      graphics: "Intel UHD Graphics"
    }
  }
];
export default laptopImages;