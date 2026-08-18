export interface Destination {
  slug: string;
  name: string;
  country: string;
  continent: string;
  tagline: string;
  description: string;
  longDescription: string;
  coordinates: { lat: number; lng: number };
  image: string;
  gallery: string[];
  highlights: string[];
  bestTimeToVisit: string;
  avgTemperature: string;
  language: string;
  currency: string;
  timezone: string;
  travelTips: string[];
  categories: string[];
}

export const destinations: Destination[] = [
  {
    slug: "bhutan",
    name: "Bhutan",
    country: "Bhutan",
    continent: "Asia",
    tagline: "The Last Shangri-La",
    description:
      "A mystical Himalayan kingdom where ancient traditions meet pristine natural beauty.",
    longDescription:
      "Bhutan, the Land of the Thunder Dragon, is a tiny Himalayan kingdom that has fiercely preserved its culture and environment. It measures prosperity through Gross National Happiness rather than GDP. From the iconic Tiger's Nest Monastery clinging to a cliff face to the vibrant tshechu festivals, Bhutan offers an experience unlike anywhere else on Earth. The country's commitment to carbon negativity and its policy of 'high value, low impact' tourism make it a truly unique destination.",
    coordinates: { lat: 27.4728, lng: 89.6393 },
    image:
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=1200&q=80",
      "https://images.unsplash.com/photo-1587922546307-776227941871?w=1200&q=80",
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80",
    ],
    highlights: [
      "Tiger's Nest Monastery",
      "Punakha Dzong",
      "Phobjikha Valley",
      "Dochula Pass",
      "Thimphu Tsechu Festival",
    ],
    bestTimeToVisit: "March–May & September–November",
    avgTemperature: "15°C / 59°F",
    language: "Dzongkha",
    currency: "Ngultrum (BTN)",
    timezone: "UTC+6",
    travelTips: [
      "All tourists must book through a licensed tour operator",
      "A daily Sustainable Development Fee of $100 USD applies",
      "Dress modestly when visiting dzongs and monasteries",
      "Altitude sickness can be an issue. Acclimatize gradually",
    ],
    categories: ["mountains", "culture", "spiritual"],
  },
  {
    slug: "greenland",
    name: "Greenland",
    country: "Greenland (Denmark)",
    continent: "North America",
    tagline: "Edge of the Arctic",
    description:
      "The world's largest island, a frontier of ice, fjords, and the northern lights.",
    longDescription:
      "Greenland is a land of extremes. The world's largest island is home to the second-largest ice sheet on Earth, yet its coasts are carved with deep fjords, colorful towns, and a rich Inuit culture stretching back thousands of years. In summer, the midnight sun bathes the landscape in an ethereal glow. In winter, the northern lights dance overhead. From dog-sledding across frozen fjords to kayaking among cathedral-sized icebergs, Greenland is an adventure at the edge of the possible.",
    coordinates: { lat: 71.7069, lng: -42.6043 },
    image:
      "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80",
    ],
    highlights: [
      "Ilulissat Icefjord (UNESCO)",
      "Northern Lights",
      "Dog Sledding",
      "Disko Bay Whale Watching",
      "Nuuk Cultural Center",
    ],
    bestTimeToVisit: "June–September (summer) or January–March (northern lights)",
    avgTemperature: "-1°C / 30°F (annual avg)",
    language: "Greenlandic, Danish",
    currency: "Danish Krone (DKK)",
    timezone: "UTC-3 to UTC",
    travelTips: [
      "There are no roads between towns. Travel is by air, boat, or dog sled",
      "Pack layers, weather changes rapidly",
      "Book accommodations well in advance, especially in summer",
      "Respect wildlife viewing distances, especially around icebergs",
    ],
    categories: ["arctic", "adventure", "nature"],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    tagline: "Where Tradition Meets Tomorrow",
    description:
      "A dazzling metropolis where ancient temples sit alongside neon-lit skyscrapers.",
    longDescription:
      "Tokyo is a city of contrasts that somehow harmonize perfectly. Serene Shinto shrines share blocks with towering neon streetscapes. Michelin-starred sushi counters sit steps from bustling ramen alleys. The world's busiest intersection, Shibuya Crossing, pulses with energy, while just minutes away, the Meiji Shrine forest offers meditative quiet. With a transit system that runs like clockwork, world-class cuisine at every price point, and a culture that prizes both innovation and tradition, Tokyo rewards every kind of traveler.",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    ],
    highlights: [
      "Senso-ji Temple",
      "Shibuya Crossing",
      "Tsukiji Outer Market",
      "Meiji Shrine",
      "Akihabara Electric Town",
      "TeamLab Borderless",
    ],
    bestTimeToVisit: "March–May (cherry blossoms) & October–November (autumn foliage)",
    avgTemperature: "16°C / 61°F",
    language: "Japanese",
    currency: "Yen (¥)",
    timezone: "UTC+9",
    travelTips: [
      "Get a Suica/Pasmo IC card for seamless transit",
      "Tipping is not customary and can be considered rude",
      "Many places are still cash-only. Carry yen",
      "Learn basic phrases: sumimasen (excuse me), arigatou (thank you)",
    ],
    categories: ["city", "culture", "food"],
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    country: "Argentina / Chile",
    continent: "South America",
    tagline: "The End of the World",
    description:
      "Untamed wilderness of glaciers, granite towers, and windswept steppe at the bottom of the world.",
    longDescription:
      "Patagonia is nature on a scale that humbles. The granite spires of Torres del Paine rise like cathedrals from the steppe. The Perito Moreno Glacier, one of the few advancing glaciers on Earth, cracks and calves with thunderous force. Guanacos roam the plains, condors circle overhead, and the wind is a constant companion. Whether you're trekking the W Circuit, kayaking among icebergs, or riding horseback across the pampas, Patagonia delivers raw, unfiltered adventure.",
    coordinates: { lat: -50.3402, lng: -72.2648 },
    image:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
      "https://images.unsplash.com/photo-1502786129293-79981df4e689?w=1200&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
    ],
    highlights: [
      "Torres del Paine W Trek",
      "Perito Moreno Glacier",
      "Fitz Roy Massif",
      "Tierra del Fuego",
      "Whale Watching at Valdés",
    ],
    bestTimeToVisit: "November–March (Patagonian summer)",
    avgTemperature: "8°C / 46°F",
    language: "Spanish",
    currency: "Argentine Peso / Chilean Peso",
    timezone: "UTC-3",
    travelTips: [
      "Book refugios months in advance for the W Trek",
      "Wind is extreme. Bring windproof layers",
      "Distances are vast. Plan logistics carefully",
      "Both Argentina and Chile sides are worth visiting",
    ],
    categories: ["mountains", "adventure", "nature"],
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    tagline: "The Red City",
    description:
      "A sensory overload of spice-scented souks, ornate riads, and the Atlas Mountains on the horizon.",
    longDescription:
      "Marrakech is an assault on the senses in the best possible way. The ancient medina, a UNESCO World Heritage site, is a labyrinth of narrow alleys opening onto hidden courtyards, ornate fountains, and centuries-old mosques. The Jemaa el-Fnaa square transforms from a daytime market into a nightly spectacle of food stalls, musicians, and storytellers. Beyond the city walls, the Atlas Mountains rise dramatically, offering trekking, Berber villages, and the gateway to the Sahara.",
    coordinates: { lat: 31.6295, lng: -7.9811 },
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80",
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80",
    ],
    highlights: [
      "Jemaa el-Fnaa Square",
      "Bahia Palace",
      "Majorelle Garden",
      "Medina Souks",
      "Atlas Mountains Day Trip",
    ],
    bestTimeToVisit: "March–May & September–November",
    avgTemperature: "20°C / 68°F",
    language: "Arabic, French, Berber",
    currency: "Moroccan Dirham (MAD)",
    timezone: "UTC+1",
    travelTips: [
      "Haggling is expected in the souks. Start at 30-40% of asking price",
      "Dress modestly, especially in the medina",
      "Hire a local guide for your first medina visit, you will get lost",
      "Drink only bottled water",
    ],
    categories: ["culture", "food", "desert"],
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    country: "New Zealand",
    continent: "Oceania",
    tagline: "Aotearoa, Land of the Long White Cloud",
    description:
      "From volcanic peaks to fjord country, a compact nation packed with every landscape on Earth.",
    longDescription:
      "New Zealand packs an impossible variety of landscapes into a country smaller than Japan. The North Island offers geothermal wonders, Maori culture, and rolling green hills. The South Island delivers alpine drama: the Southern Alps, Milford Sound's sheer fjord walls, and glaciers that descend into rainforest. The adventure capital of the world, Queenstown, offers bungee jumping, jet boating, and heli-skiing. But it's the people and culture that linger longest: the Maori concept of kaitiakitanga (guardianship) shapes the national identity.",
    coordinates: { lat: -44.5638, lng: 168.7125 },
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80",
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80",
    ],
    highlights: [
      "Milford Sound",
      "Tongariro Alpine Crossing",
      "Queenstown Adventure",
      "Hobbiton Movie Set",
      "Abel Tasman Coastal Track",
    ],
    bestTimeToVisit: "December–February (summer)",
    avgTemperature: "12°C / 54°F",
    language: "English, Māori",
    currency: "New Zealand Dollar (NZD)",
    timezone: "UTC+12",
    travelTips: [
      "Rent a campervan for maximum flexibility",
      "Book Great Walk huts months in advance",
      "The UV index is extreme. Wear sunscreen year-round",
      "Drive on the left, roads are winding, take it slow",
    ],
    categories: ["adventure", "nature", "mountains"],
  },
];

// Import extra destinations and merge
import { extraDestinations } from "./destinations-extra";
import { extraDestinations2 } from "./destinations-extra2";

// Combine all, deduplicate by slug
const allSlugs = new Set(destinations.map((d) => d.slug));
const merged = [...destinations];
for (const d of [...extraDestinations, ...extraDestinations2]) {
  if (!allSlugs.has(d.slug)) {
    allSlugs.add(d.slug);
    merged.push(d);
  }
}

export { merged as allDestinations };

export function getDestinationBySlug(slug: string): Destination | undefined {
  return merged.find((d) => d.slug === slug);
}

export function getFeaturedDestinations(): Destination[] {
  return merged.filter((d) =>
    ["bhutan", "greenland", "tokyo", "patagonia"].includes(d.slug)
  );
}
