import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Property from "./models/Property.js";

dotenv.config();

const usersData = [
  {
    name: "Admin Heaven",
    email: "admin@heaven.com",
    password: "adminpassword",
    role: "admin",
    phone: "9999999999",
    bio: "Administrator of Heaven Village portal.",
    location: { city: "Bangalore", state: "Karnataka" },
    isVerified: true,
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@heaven.com",
    password: "password123",
    role: "owner",
    phone: "9876543210",
    bio: "Real estate enthusiast with properties in prime locations.",
    location: { city: "Mumbai", state: "Maharashtra" },
    isVerified: true,
  },
  {
    name: "Priya Patel",
    email: "priya@heaven.com",
    password: "password123",
    role: "owner",
    phone: "8765432109",
    bio: "Offering cozy and affordable PG accommodations and apartments.",
    location: { city: "Pune", state: "Maharashtra" },
    isVerified: true,
  },
  {
    name: "Amit Sharma",
    email: "amit@heaven.com",
    password: "password123",
    role: "owner",
    phone: "7654321098",
    bio: "Boutique villa and luxury home owner.",
    location: { city: "Goa", state: "Goa" },
    isVerified: true,
  },
  {
    name: "Vikram Singh",
    email: "vikram@heaven.com",
    password: "password123",
    role: "tenant",
    phone: "6543210987",
    bio: "Software developer looking for a calm place to work.",
    location: { city: "Bangalore", state: "Karnataka" },
    isVerified: true,
  },
  {
    name: "Ananya Sen",
    email: "ananya@heaven.com",
    password: "password123",
    role: "tenant",
    phone: "5432109876",
    bio: "Student looking for a shared room or PG.",
    location: { city: "Delhi", state: "Delhi" },
    isVerified: true,
  }
];

const propertiesData = [
  {
    title: "Luxury 4BHK Villa with Private Pool",
    description: "Stunning beachfront villa featuring 4 spacious bedrooms, a private infinity pool, a lush tropical garden, and direct access to the beach. Fully furnished with high-end designer fittings.",
    price: 75000,
    propertyType: "villa",
    location: {
      address: "102 Beach Road, Candolim",
      city: "Goa",
      state: "Goa",
      pincode: "403515"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_villa_1"
      },
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_villa_2"
      }
    ],
    bedrooms: 4,
    bathrooms: 4,
    area: 4500,
    amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Furnished", "Pets Allowed"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Modern 2BHK Apartment Near Metro Station",
    description: "Beautiful modern apartment located just 5 minutes walk from the central metro station. Includes modular kitchen, private balcony, video security door, and covered parking slot.",
    price: 25000,
    propertyType: "apartment",
    location: {
      address: "B-405, Green Heights, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_apt_1"
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_apt_2"
      }
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["WiFi", "AC", "Parking", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Premium Girls PG with Food & WiFi",
    description: "Fully-managed, highly secure PG for girls in sector 62. Daily professional cleaning, high-speed WiFi, three meals a day included in rent, air-conditioned rooms, and 24/7 security warden.",
    price: 8500,
    propertyType: "pg",
    location: {
      address: "House 24, Lane 3, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_pg_1"
      }
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 250,
    amenities: ["WiFi", "AC", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Charming 3 BHK Family House with Garden",
    description: "Perfect family house situated in a peaceful gated community. Comes with a spacious backyard, private garden, large living area, separate dining space, and space for pet animals.",
    price: 38000,
    propertyType: "house",
    location: {
      address: "Avenue-15, Royal Meadows",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411007"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_house_1"
      },
      {
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_house_2"
      }
    ],
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    amenities: ["Parking", "Pets Allowed", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Studio Apartment in Hiranandani",
    description: "Compact and stylish single occupancy studio apartment inside the prestigious Hiranandani estate. Ideal for single working professionals. Complete with gym access and pool access.",
    price: 18000,
    propertyType: "apartment",
    location: {
      address: "Silver Oak Towers, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_studio_1"
      }
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    amenities: ["WiFi", "AC", "Gym", "Pool", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Scenic Lakeview 5BHK Villa",
    description: "Experience the ultimate luxury lifestyle in this gorgeous lakeside villa. Expansive floor plan, wrap-around balcony facing the lake, full size private gymnasium, private theater, and smart home automation.",
    price: 120000,
    propertyType: "villa",
    location: {
      address: "44 Orchid Lane, Lake Area",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_villa3_1"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_villa3_2"
      }
    ],
    bedrooms: 5,
    bathrooms: 6,
    area: 6000,
    amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Furnished", "Pets Allowed"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Affordable Boys PG in Sector 15",
    description: "Budget-friendly shared accommodation options for male students and working executives. Common TV hall, high-speed fiber internet, and power backup. Cleaning service thrice a week.",
    price: 5500,
    propertyType: "pg",
    location: {
      address: "Sector 15, Near Metro Pillar 110",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_pg_boy_1"
      }
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 180,
    amenities: ["WiFi", "Parking"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Spacious 4BHK House with Backyard",
    description: "Generous 4-bedroom house with high ceilings, large windows, modular wardrobes, and a landscaped backyard. Nestled in a peaceful residential locality close to international schools.",
    price: 50000,
    propertyType: "house",
    location: {
      address: "Plot 89, Sector 2, HSR Layout",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560102"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_house2_1"
      }
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    amenities: ["Parking", "Pets Allowed", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Cozy 1BHK Apartment in Juhu",
    description: "Compact 1 bedroom apartment located in a quiet leafy lane of Juhu, just 10 minutes walk to the beach. Well ventilated with basic wooden furnishings and immediate availability.",
    price: 32000,
    propertyType: "apartment",
    location: {
      address: "Flat 12, Rosewood Apts, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400049"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_juhu_1"
      }
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ["AC", "Furnished"],
    status: "approved",
    availabilityStatus: "available"
  },
  {
    title: "Pending Approval: Sunset Hills Villa",
    description: "Luxury hill-view villa under consideration. 3 master bedrooms, spacious wrap-around deck, modern fireplace, and double garage. (This listing is pending admin approval).",
    price: 90000,
    propertyType: "villa",
    location: {
      address: "15 Sunset Hills Road",
      city: "Goa",
      state: "Goa",
      pincode: "403001"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_pending_villa"
      }
    ],
    bedrooms: 3,
    bathrooms: 4,
    area: 3800,
    amenities: ["WiFi", "AC", "Parking", "Pool", "Furnished"],
    status: "pending",
    availabilityStatus: "available"
  },
  {
    title: "Pending Approval: City Center PG",
    description: "Modern PG in central business district. Easy commute to IT parks. High-speed internet, cafeteria, and housekeeping.",
    price: 9500,
    propertyType: "pg",
    location: {
      address: "42 Mall Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_pending_pg"
      }
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    amenities: ["WiFi", "AC", "Furnished"],
    status: "pending",
    availabilityStatus: "available"
  },
  {
    title: "Rented Out: Cozy Suburban Cottage",
    description: "Charming family cottage with a retro feel. (Currently rented out). Spacious backyard and wooden deck.",
    price: 20000,
    propertyType: "house",
    location: {
      address: "88 Willow Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        public_id: "seed_rented_house"
      }
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ["Parking", "Pets Allowed"],
    status: "approved",
    availabilityStatus: "rented"
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    // Clear existing data
    console.log("Clearing existing properties and users...");
    await Property.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared databases!");

    // Insert Users
    console.log("Hashing passwords and seeding users...");
    const createdUsers = [];
    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.password, 12);
      const newUser = await User.create({
        ...u,
        password: hashedPassword,
      });
      createdUsers.push(newUser);
    }
    console.log(`Successfully seeded ${createdUsers.length} users!`);

    // Group owners to assign properties
    const owners = createdUsers.filter(u => u.role === "owner");
    if (owners.length === 0) {
      throw new Error("No owners found in seed data, cannot assign properties.");
    }

    // Insert Properties
    console.log("Seeding properties...");
    let propertyCount = 0;
    for (let i = 0; i < propertiesData.length; i++) {
      const prop = propertiesData[i];
      // Distribute properties round-robin among owners
      const owner = owners[i % owners.length];

      await Property.create({
        ...prop,
        owner: owner._id,
      });
      propertyCount++;
    }

    console.log(`Successfully seeded ${propertyCount} properties!`);
    console.log("Seeding complete! Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
