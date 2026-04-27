// ==========================
// 🍕 PIZZAVIBE PREMIUM SPECIALS (20 UNIQUE HANDCRAFTED PIZZAS)
// Accurate Domino's codes included for backend validation
// ==========================

const PIZZAVIBE_SPECIALS = [
  {
    id: "pv-1",
    name: "Classic Margherita",
    code: "MARG",
    dsc: "A true classic with our signature mozzarella blend and fresh basil oil. Simple, yet perfection.",
    img: "https://www.dominos.co.in/files/items/Margherit.jpg",
    price: 239,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-2",
    name: "Vibe Farmhouse",
    code: "FARM",
    dsc: "Our most loved veggie mix: Crunchy onions, vibrant capsicum, juicy tomatoes, and herbed mushrooms.",
    img: "https://www.dominos.co.in/files/items/Farmhouse.jpg",
    price: 459,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-3",
    name: "Paneer Tikka Passion",
    code: "PEPPY",
    dsc: "Soft, marinated paneer chunks with capsicum and spicy red paprika for that authentic desi kick.",
    img: "https://www.dominos.co.in/files/items/Peppy_Paneer.jpg",
    price: 459,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-4",
    name: "Veggie Paradise",
    code: "VEGP",
    dsc: "An explosion of flavors with golden corn, black olives, capsicum, and a touch of red paprika.",
    img: "https://www.dominos.co.in/files/items/Veggie_Paradise.jpg",
    price: 459,
    rate: 4,
    isVeg: true
  },
  {
    id: "pv-5",
    name: "The Tandoori Special",
    code: "TAND",
    dsc: "Spicy tandoori paneer balanced with fresh capsicum and our house-secret mint mayo drizzle.",
    img: "https://www.dominos.co.in/files/items/IndianTandooriPaneer.jpg",
    price: 549,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-6",
    name: "Golden Chicken Delight",
    code: "GOLDC",
    dsc: "Savory minced chicken and herbed chicken strips topped with sweet golden corn.",
    img: "https://www.dominos.co.in/files/items/MicrosoftTeams-image_(14).png",
    price: 499,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-7",
    name: "Non-Veg Supreme",
    code: "NVSUP",
    dsc: "The ultimate meat feast: Black olives, BBQ chicken, peri-peri chicken, and grilled chicken rashers.",
    img: "https://www.dominos.co.in/files/items/Non-Veg_Supreme.jpg",
    price: 629,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-8",
    name: "The Dominator",
    code: "DOMN",
    dsc: "Loaded with triple-threat chicken: Pepper barbecue, peri-peri, and tandoori chicken tikka.",
    img: "https://www.dominos.co.in/files/items/MicrosoftTeams-image_(11).png",
    price: 629,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-9",
    name: "Mexican Green Wave",
    code: "MEXW",
    dsc: "A spicy delight with crunchy onions, capsicum, tomato & jalapeno with a sprinkle of exotic Mexican herbs.",
    img: "https://www.dominos.co.in/files/items/Mexican_Green_Wave.jpg",
    price: 399,
    rate: 4,
    isVeg: true
  },
  {
    id: "pv-10",
    name: "Chicken Fiesta",
    code: "CHKF",
    dsc: "Grilled chicken rashers, peri-peri chicken, onion, and capsicum on a cheesy bed.",
    img: "https://www.dominos.co.in/files/items/chick_fiesta.jpg",
    price: 549,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-11",
    name: "Double Cheese Margherita",
    code: "DCMG",
    dsc: "For the true cheese lovers: Our classic Margherita with an extra layer of premium mozzarella.",
    img: "https://www.dominos.co.in/files/items/Double_Cheese_Margherita.jpg",
    price: 339,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-12",
    name: "Indi Chicken Tikka",
    code: "INDK",
    dsc: "The Indian favorite: Succulent chicken tikka with onion, capsicum and spicy red paprika.",
    img: "https://www.dominos.co.in/files/items/IndianChickenTikka.jpg",
    price: 599,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-13",
    name: "Paneer Makhani Magic",
    code: "PMAK",
    dsc: "Paneer chunks in a creamy Makhani sauce with capsicum and spicy red paprika.",
    img: "https://www.dominos.co.in/files/items/Paneer_Makhni.jpg",
    price: 549,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-14",
    name: "Keema Do Pyaza",
    code: "KEMA",
    dsc: "Traditional minced chicken (Keema) with crunchy onions and green chilies.",
    img: "https://www.dominos.co.in/files/items/Chicken_Keema_Do_Pyaza.jpg",
    price: 499,
    rate: 4,
    isVeg: false
  },
  {
    id: "pv-15",
    name: "Corn & Cheese Burst",
    code: "CORN",
    dsc: "Sweet golden corn swimming in a pool of gooey, melted cheese.",
    img: "https://www.dominos.co.in/files/items/Corn_&_Cheese.jpg",
    price: 299,
    rate: 4,
    isVeg: true
  },
  {
    id: "pv-16",
    name: "Pepper BBQ & Onion",
    code: "PBBQ",
    dsc: "Succulent pepper barbecue chicken slices with crunchy onions.",
    img: "https://www.dominos.co.in/files/items/Pepper_Barbeque_&_Onion.jpg",
    price: 459,
    rate: 5,
    isVeg: false
  },
  {
    id: "pv-17",
    name: "Achari Do Pyaza",
    code: "ACHR",
    dsc: "Tangy pickled paneer chunks with plenty of onions and fresh herbs.",
    img: "https://www.dominos.co.in/files/items/AchariDoPyaza.jpg",
    price: 399,
    rate: 4,
    isVeg: true
  },
  {
    id: "pv-18",
    name: "The Spiced Paneer",
    code: "SPDP",
    dsc: "Freshly spiced paneer chunks with capsicum and red paprika on a thin crust.",
    img: "https://www.dominos.co.in/files/items/Fresh_Veggie.jpg",
    price: 459,
    rate: 5,
    isVeg: true
  },
  {
    id: "pv-19",
    name: "Chicken Sausage Sensation",
    code: "CSAU",
    dsc: "Juicy chicken sausage slices with sweet corn and extra mozzarella.",
    img: "https://www.dominos.co.in/files/items/Chicken_Sausage.jpg",
    price: 399,
    rate: 4,
    isVeg: false
  },
  {
    id: "pv-20",
    name: "Vibe Garden Special",
    code: "VGARD",
    dsc: "A lush garden of onions, capsicum, tomato, mushroom and olives.",
    img: "https://www.dominos.co.in/files/items/Veg_Extravaganz.jpg",
    price: 549,
    rate: 5,
    isVeg: true
  }
];

// Fallback high-quality images
const PIZZA_BACKUP = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

// ==========================
// 📦 API FUNCTIONS
// ==========================

export const getByCategory = async (category) => {
  if (category === 'pizzas') {
    return PIZZAVIBE_SPECIALS;
  }
  return []; 
};

export const localizeItem = (item) => {
  return {
    ...item,
    description: item.dsc,
    image: item.img || PIZZA_BACKUP,
    price: item.price,
    code: item.code || '14SCREEN', // Fallback to standard code
    isVeg: item.isVeg,
    badges: [
      item.isVeg ? 'Veg' : 'Non-Veg',
      item.rate >= 5 ? 'Chef Spl' : ''
    ].filter(Boolean)
  };
};

export const isIndianDish = () => true;

// ==========================
// 👨‍🍳 EXTRA DATA
// ==========================

export const getChefTip = async () => {
  const tips = [
    "Our dough is hand-stretched and baked at 450°C for the perfect char.",
    "Try the Paneer Makhani Magic for a creamy, buttery experience.",
    "The Vibe Garden Special is our most nutritious and loaded veg option.",
    "Order a side of our peri-peri fries to complete your meal.",
    "Our Non-Veg Supreme features 4 different types of premium chicken."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

export const getLocalWeather = async () => ({ temp: 28, desc: 'Clear Vibe', city: 'Mumbai' });
