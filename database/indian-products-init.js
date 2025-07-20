// Add India-specific pet products
use petshop;

db.products.insertMany([
  {
    name: "Pedigree Adult Dog Food (Chicken & Vegetables)",
    description: "Complete nutrition for adult dogs with real chicken and vegetables. Popular Indian brand.",
    price: 12.50, // Will show as ₹1037.50
    category: "dogs",
    brand: "Pedigree India",
    stock: 75,
    image: "/images/pedigree-india.jpg",
    rating: 4.3,
    numReviews: 245
  },
  {
    name: "Whiskas Cat Food (Ocean Fish)",
    description: "Premium cat food with ocean fish, specially formulated for Indian cats.",
    price: 8.99, // Will show as ₹746.17
    category: "cats",
    brand: "Whiskas India",
    stock: 60,
    image: "/images/whiskas-india.jpg",
    rating: 4.1,
    numReviews: 189
  },
  {
    name: "Indian Parrot Mix Seeds",
    description: "Special seed mix for Indian parrots including green chili and local grains.",
    price: 4.50, // Will show as ₹373.50
    category: "birds",
    brand: "Desi Bird Care",
    stock: 120,
    image: "/images/parrot-mix-india.jpg",
    rating: 4.6,
    numReviews: 156
  },
  {
    name: "Goldfish Food (Indian Formula)",
    description: "Specialized food for goldfish adapted to Indian water conditions.",
    price: 3.25, // Will show as ₹269.75
    category: "fish",
    brand: "AquaIndia",
    stock: 90,
    image: "/images/goldfish-food-india.jpg",
    rating: 4.2,
    numReviews: 78
  },
  {
    name: "Desi Cow Milk for Puppies",
    description: "Pure desi cow milk powder supplement for puppies and lactating mothers.",
    price: 15.75, // Will show as ₹1307.25
    category: "dogs",
    brand: "GauMata Pet Care",
    stock: 45,
    image: "/images/cow-milk-puppies.jpg",
    rating: 4.7,
    numReviews: 134
  },
  {
    name: "Neem-based Flea Powder",
    description: "Natural flea and tick powder made with neem and tulsi - traditional Indian remedy.",
    price: 6.25, // Will show as ₹518.75
    category: "dogs",
    brand: "Ayurvet India",
    stock: 80,
    image: "/images/neem-flea-powder.jpg",
    rating: 4.4,
    numReviews: 198
  },
  {
    name: "Bamboo Cat Scratcher",
    description: "Eco-friendly cat scratcher made from Bengal bamboo.",
    price: 18.50, // Will show as ₹1535.50
    category: "cats",
    brand: "Bengal Bamboo Crafts",
    stock: 25,
    image: "/images/bamboo-scratcher.jpg",
    rating: 4.5,
    numReviews: 87
  },
  {
    name: "Indian Street Dog Collar (Handwoven)",
    description: "Traditional handwoven collar supporting local artisans from West Bengal.",
    price: 9.75, // Will show as ₹809.25
    category: "dogs",
    brand: "Bengal Handlooms",
    stock: 55,
    image: "/images/handwoven-collar.jpg",
    rating: 4.8,
    numReviews: 167
  }
]);

print("Indian pet products added successfully!");