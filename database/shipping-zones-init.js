// Initialize shipping zones for Sandy's Pet Care Solution
use petshop;

db.shippingzones.insertMany([
  {
    name: "West Bengal Local",
    type: "local",
    areas: [
      "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", 
      "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur",
      "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Chinsurah"
    ],
    baseRate: 40,
    perKgRate: 10,
    freeShippingThreshold: 999,
    estimatedDays: { min: 1, max: 3 }
  },
  {
    name: "Eastern India",
    type: "state",
    areas: [
      "Odisha", "Jharkhand", "Bihar", "Assam", "Tripura", 
      "Manipur", "Meghalaya", "Nagaland", "Arunachal Pradesh", "Mizoram", "Sikkim"
    ],
    baseRate: 80,
    perKgRate: 15,
    freeShippingThreshold: 1499,
    estimatedDays: { min: 3, max: 7 }
  },
  {
    name: "All India",
    type: "national",
    areas: [
      "Delhi", "Mumbai", "Chennai", "Bangalore", "Hyderabad", 
      "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Other Cities"
    ],
    baseRate: 120,
    perKgRate: 20,
    freeShippingThreshold: 1999,
    estimatedDays: { min: 5, max: 10 }
  }
]);

print("Shipping zones initialized for Sandy's Pet Care Solution!");