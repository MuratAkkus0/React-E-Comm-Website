import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Fashion",
  "Sports & Outdoors",
  "Books",
  "Beauty & Personal Care",
];

const products: Array<{
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  category: string;
}> = [
  {
    name: "Aria Wireless Over-Ear Headphones",
    description:
      "Active noise-cancelling over-ear headphones with 40-hour battery life, multipoint Bluetooth 5.3, and a foldable design for travel.",
    priceCents: 17999,
    stock: 42,
    category: "Electronics",
  },
  {
    name: "Vantage 14 Ultrabook Sleeve",
    description:
      "Water-resistant neoprene sleeve for 13-15 inch laptops with a soft microfiber interior and a slim front pocket for cables.",
    priceCents: 2499,
    stock: 120,
    category: "Electronics",
  },
  {
    name: "Pulse Fitness Smartwatch",
    description:
      "Aluminium-cased smartwatch with continuous heart-rate tracking, GPS, 7-day battery life, and 50m water resistance.",
    priceCents: 14999,
    stock: 35,
    category: "Electronics",
  },
  {
    name: "Lumen 65W GaN Charger",
    description:
      "Compact 3-port GaN charger delivering 65W total output, fast enough for a laptop and two phones at once.",
    priceCents: 4499,
    stock: 80,
    category: "Electronics",
  },
  {
    name: "Orbit Portable Bluetooth Speaker",
    description:
      "IPX7 waterproof speaker with 24-hour playtime, deep bass, and a carabiner clip for hiking or the beach.",
    priceCents: 6999,
    stock: 58,
    category: "Electronics",
  },
  {
    name: "Cascade 12-Piece Cookware Set",
    description:
      "Hard-anodized aluminium pots and pans with a nonstick ceramic coating, tempered glass lids, and stay-cool handles.",
    priceCents: 24999,
    stock: 22,
    category: "Home & Kitchen",
  },
  {
    name: "Meridian French Press, 1L",
    description:
      "Borosilicate glass French press with a stainless steel mesh filter and insulated outer sleeve for slower heat loss.",
    priceCents: 3299,
    stock: 90,
    category: "Home & Kitchen",
  },
  {
    name: "Hearth Cast Iron Skillet, 10-inch",
    description:
      "Pre-seasoned cast iron skillet that goes from stovetop to oven to table, and gets better with every use.",
    priceCents: 4199,
    stock: 65,
    category: "Home & Kitchen",
  },
  {
    name: "Nimbus Memory Foam Pillow, Set of 2",
    description:
      "Contoured memory foam pillows with a breathable bamboo-blend cover, designed for side and back sleepers.",
    priceCents: 5499,
    stock: 70,
    category: "Home & Kitchen",
  },
  {
    name: "Solstice Ceramic Dinnerware Set, 16-Piece",
    description:
      "Chip-resistant stoneware dinnerware for four: dinner plates, side plates, bowls, and mugs in a matte glaze.",
    priceCents: 8999,
    stock: 30,
    category: "Home & Kitchen",
  },
  {
    name: "Drift Merino Wool Crewneck Sweater",
    description:
      "Midweight 100% merino wool sweater, naturally odor-resistant and temperature-regulating for everyday wear.",
    priceCents: 8999,
    stock: 54,
    category: "Fashion",
  },
  {
    name: "Harbor Selvedge Denim Jeans",
    description:
      "Straight-fit jeans cut from 13oz Japanese selvedge denim, garment-washed for a broken-in feel from day one.",
    priceCents: 11999,
    stock: 46,
    category: "Fashion",
  },
  {
    name: "Aspen Waterproof Rain Jacket",
    description:
      "Lightweight 3-layer waterproof shell with sealed seams, pit zips, and a packable hood for unpredictable weather.",
    priceCents: 13999,
    stock: 38,
    category: "Fashion",
  },
  {
    name: "Trail Leather Chelsea Boots",
    description:
      "Full-grain leather Chelsea boots with a Goodyear-welted sole built to be resoled rather than replaced.",
    priceCents: 15999,
    stock: 27,
    category: "Fashion",
  },
  {
    name: "Compass Canvas Tote Bag",
    description:
      "Heavyweight 16oz cotton canvas tote with a reinforced base and leather straps, sized for a day of errands.",
    priceCents: 3999,
    stock: 100,
    category: "Fashion",
  },
  {
    name: "Ridgeline 65L Trekking Backpack",
    description:
      "Adjustable-fit trekking pack with a ventilated back panel, rain cover, and a hydration bladder sleeve.",
    priceCents: 18999,
    stock: 24,
    category: "Sports & Outdoors",
  },
  {
    name: "Summit Insulated Water Bottle, 1L",
    description:
      "Double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12, leak-proof lid included.",
    priceCents: 2999,
    stock: 140,
    category: "Sports & Outdoors",
  },
  {
    name: "ProGrip Adjustable Dumbbell Set",
    description:
      "Space-saving adjustable dumbbells, 5-25kg per hand in 2.5kg increments, with a quick dial-lock mechanism.",
    priceCents: 21999,
    stock: 18,
    category: "Sports & Outdoors",
  },
  {
    name: "TrailRunner All-Terrain Running Shoes",
    description:
      "Grippy lugged outsole and a breathable knit upper built for mixed road-and-trail running in any weather.",
    priceCents: 12999,
    stock: 44,
    category: "Sports & Outdoors",
  },
  {
    name: "Basecamp 2-Person Tent",
    description:
      "Freestanding 3-season tent with a full-coverage rainfly, two vestibules, and a 3.2kg packed weight.",
    priceCents: 19999,
    stock: 20,
    category: "Sports & Outdoors",
  },
  {
    name: "The Quiet Engineer",
    description:
      "A novel about a systems engineer who discovers the outage that changes everything about how she sees her work.",
    priceCents: 1899,
    stock: 75,
    category: "Books",
  },
  {
    name: "Atlas of Deep-Sea Life",
    description:
      "An illustrated field guide to bioluminescent and deep-trench species, with photography from twelve research expeditions.",
    priceCents: 3499,
    stock: 50,
    category: "Books",
  },
  {
    name: "Cooking with Fire: A Live-Flame Cookbook",
    description:
      "Seventy recipes built around wood-fired grills and open flame, from weeknight vegetables to whole roasted fish.",
    priceCents: 2799,
    stock: 60,
    category: "Books",
  },
  {
    name: "Mineral Sunscreen SPF 50",
    description:
      "Reef-safe zinc oxide sunscreen with a lightweight, no-white-cast finish for daily wear under makeup.",
    priceCents: 2299,
    stock: 95,
    category: "Beauty & Personal Care",
  },
  {
    name: "Restore Overnight Repair Serum",
    description:
      "A hyaluronic acid and niacinamide serum formulated to support skin barrier repair while you sleep.",
    priceCents: 3999,
    stock: 66,
    category: "Beauty & Personal Care",
  },
  {
    name: "Cedarwood & Sage Bar Soap, 3-Pack",
    description:
      "Cold-processed bar soap with shea butter and a woody, herbal scent, free of sulfates and parabens.",
    priceCents: 1699,
    stock: 110,
    category: "Beauty & Personal Care",
  },
];

async function main() {
  console.log("Seeding database...");

  const categoryIdByName = new Map<string, number>();
  for (const name of categories) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    categoryIdByName.set(name, category.id);
  }

  for (const product of products) {
    const categoryId = categoryIdByName.get(product.category);
    if (!categoryId) throw new Error(`Unknown category: ${product.category}`);

    const slug = slugify(product.name);
    await prisma.product.upsert({
      where: { slug },
      update: {
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        categoryId,
      },
      create: {
        name: product.name,
        slug,
        description: product.description,
        priceCents: product.priceCents,
        currency: "EUR",
        stock: product.stock,
        categoryId,
      },
    });
  }

  const adminPasswordHash = await bcrypt.hash("Admin1234!", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Store Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const demoPasswordHash = await bcrypt.hash("Demo1234!", 12);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Shopper",
      passwordHash: demoPasswordHash,
      role: "USER",
    },
  });

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  console.log("Admin login: admin@example.com / Admin1234!");
  console.log("Demo user login: demo@example.com / Demo1234!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
