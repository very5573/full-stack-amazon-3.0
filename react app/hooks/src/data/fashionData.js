const sareeNames = [
  "Graceful Garnet Weave", "Royal Emerald Charm", "Sunset Amber Silhouette", "Velvet Indigo Elegance",
  "Pearl Peach Drapes", "Mystic Mauve Magic", "Twilight Teal Threads", "Crimson Classic Muse",
  "Golden Bloom Radiance", "Ocean Mist Pattern", "Ivory Enigma Touch", "Lavender Lush Loom",
  "Turquoise Tale Saree", "Rosewood Glimmer Grace", "Sapphire Serenity Style", "Moonbeam Silver Spark",
  "Cinnamon Flame Wrap", "Jade Whisper Drape", "Champagne Blush Classic", "Copper Dust Swirl",
  "Blush Breeze Saree", "Storm Grey Symphony", "Coral Delight Wrap", "Scarlet Petal Power",
  "Mint Mirage Beauty", "Honeydew Harmony", "Midnight Violet Vogue", "Cobalt Shine Saree",
  "Orchid Dream Threads", "Maple Magic Drape", "Pink Pearl Radiance", "Royal Plum Weave",
  "Sunray Glow Saree", "Skyline Azure Charm", "Almond Gold Affair", "Berry Bloom Wrap",
  "Frosty Rose Embellish", "Caramel Cream Classic", "Forest Fern Festive", "Lemon Zest Drapes",
  "Velvet Rust Vogue", "Serene Sky Weave", "Amber Ash Designer", "Fuchsia Fantasy Flow",
  "Mulberry Mood Saree", "Blazing Bronze Threads", "Whispering Willow Drape", "Crème Coral Elegance",
  "Azure Breeze Affair", "Antique Ruby Wrap", "Glazed Mocha Muse", "Celestial Creamy Touch",
  "Dreamy Denim Drape", "Wheat Wave Wonder", "Rosy Dust Threads", "Mango Mist Classic",
  "Teal Trance Saree", "Gilded Sandstorm Wrap", "Lilac Twilight Drape", "Sparkling Maroon Flame",
  "Dusty Mint Drapes", "Cinnamon Bronze Bliss", "Frosted Lavender Wrap", "Twilight Mocha Elegance",
  "Smoky Pink Power", "Dusky Champagne Threads", "Blossom Beige Delight", "Ivory Blush Magic",
  "Zesty Coral Zeal", "Pine Green Poise", "Opal Orchid Saree", "Sunlit Honey Wrap",
  "Mellow Grey Muse", "Nude Rose Drapes", "Spiced Wine Elegance", "Amber Silk Symphony",
  "Golden Topaz Trend", "Vintage Mauve Vogue", "Peachwood Dream", "Violet Tranquil Wrap",
  "Radiant Terracotta Style", "Royal Walnut Charm", "Seafoam Breeze Touch", "Cherry Mocha Muse",
  "Hazelnut Glimmer Grace", "Pastel Peach Whisper", "Burnt Sienna Splendor", "Crystal Beige Threads"
];

const fashionData = [
  // Your first 5 static sarees here...
  {
    id: 1,
    img: require("../assets/fashion/fashion (1).jpg"),
    title: "Yashika Women's Printed Saree - Minali Mustard",
    price: 2499,
    description: "Beautiful printed saree with a vibrant mustard color, perfect for festive occasions.",
    category: "Printed Saree",
    material: "Cotton Blend",
    occasion: "Casual & Party Wear"
  },
  {
    id: 2,
    img: require("../assets/fashion/fashion (2).jpg"),
    title: "Vibrant Silk Saree in Maroon & Gold",
    price: 3999,
    description: "A luxurious silk saree with a rich maroon and gold combination, ideal for weddings.",
    category: "Silk Saree",
    material: "Pure Silk",
    occasion: "Wedding & Festive"
  },
  {
    id: 3,
    img: require("../assets/fashion/fashion (3).jpg"),
    title: "Classic Blue Chiffon Saree with Embroidery",
    price: 2999,
    description: "Elegant chiffon saree with delicate embroidery, perfect for evening wear.",
    category: "Chiffon Saree",
    material: "Chiffon",
    occasion: "Evening Party"
  },
  {
    id: 4,
    img: require("../assets/fashion/fashion (4).jpg"),
    title: "Designer Banarasi Saree with Floral Motif",
    price: 8499,
    description: "Premium Banarasi saree with intricate floral motifs, great for traditional events.",
    category: "Banarasi Saree",
    material: "Banarasi Silk",
    occasion: "Traditional & Wedding"
  },
  {
    id: 5,
    img: require("../assets/fashion/fashion (5).jpg"),
    title: "Georgette Saree in Coral with Golden Border",
    price: 3499,
    description: "Lightweight georgette saree in a stunning coral color with a golden border.",
    category: "Georgette Saree",
    material: "Georgette",
    occasion: "Casual & Festive"
  },
  ...Array.from({ length: 80 }, (_, i) => {
    const id = 6 + i;
    const name = sareeNames[i];
    return {
      id,
      img: require(`../assets/fashion/fashion (${id}).jpg`),
      title: name,
      price: Math.floor(Math.random() * 10000) + 1999,
      description: `A stunning saree with unique design "${name}", perfect for all occasions.`,
      category: `Saree Category ${id}`,
      material: "Mixed Material",
      occasion: "Festive & Wedding"
    };
  })
];

export default fashionData;
