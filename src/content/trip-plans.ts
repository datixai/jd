// Full day by day plans for each trip, shown on /trips and /trips/[slug].
// These are draft plans for Junaid to review; routes, stays and meals can change with the season and the family.

export type Meals = { breakfast: string; lunch: string; dinner: string };

export type TripDay = {
  title: string;
  route: string;
  drive?: string;
  activities: string[];
  stay: string;
  meals: Meals;
};

export type TripPlan = {
  slug: string;
  title: string;
  region: string;
  days: number;
  nights: number;
  groupSize: string;
  bestTime: string;
  startFrom: string;
  vehicle: string;
  image: string;
  photos: string[];
  overview: string;
  highlights: string[];
  itinerary: TripDay[];
  included: string[];
  notIncluded: string[];
  bring: string[];
  goodToKnow: string[];
};

const pickup = "Pickup from your home in Kotli, Khuiratta, Dadyal or Mirpur";
const groupVan = "2 to 14 people per van. Bigger families or groups travel in two or more vehicles.";
const included = [
  "Private vehicle with an experienced local driver",
  "Fuel, tolls and parking",
  "Pickup and drop off at your home",
  "Hotel or guest house rooms for every night (family rooms where possible)",
  "Breakfast every day",
  "JD on WhatsApp for the whole trip",
];
const notIncluded = [
  "Lunch and dinner (JD suggests trusted halal places and can arrange them for you)",
  "Jeep rides, chairlifts, boats and entry tickets",
  "Personal shopping and tips",
];
const bringMountains = [
  "Warm jacket and a light sweater, even in summer",
  "Comfortable shoes for short walks",
  "CNIC or NICOP and passport copies for checkposts",
  "Sunglasses, sun cream and a cap",
  "Any regular medicines, plus travel sickness tablets for winding roads",
  "Power bank and cash (cards do not work in many mountain areas)",
];

export const tripPlans: TripPlan[] = [
  {
    slug: "neelum-valley",
    title: "Neelum Valley Family Escape",
    region: "Azad Jammu Kashmir",
    days: 4,
    nights: 3,
    groupSize: groupVan,
    bestTime: "April to October. Upper Neelum roads can close in heavy winter snow.",
    startFrom: pickup,
    vehicle: "Toyota HiAce or Grand Cabin. Jeep for Arang Kel tracks if needed.",
    image: "/media/reels/arangkel.webp",
    photos: ["/media/ig/sharda.webp", "/media/reels/neelum.webp", "/media/reels/kail.webp", "/media/ig/gurez.webp"],
    overview:
      "The classic Kashmir trip. Follow the blue Neelum river from Muzaffarabad up to Keran, Sharda and Kel, then ride the chairlift to the meadow village of Arang Kel. Easy for elders, exciting for children.",
    highlights: ["Keran riverside", "Sharda and the Sharda Peeth ruins", "Kel and the Arang Kel chairlift", "Fresh Neelum trout", "Wooden village houses and green meadows"],
    itinerary: [
      {
        title: "Home to Keran",
        route: "Kotli / Mirpur to Muzaffarabad to Keran",
        drive: "About 7 to 8 hours with stops",
        activities: ["Morning pickup from your home", "Tea stop and lunch in Muzaffarabad", "Afternoon drive along the Neelum river", "Evening walk by the river in Keran"],
        stay: "Riverside guest house in Keran",
        meals: { breakfast: "At home before pickup", lunch: "Chicken karahi, daal and naan in Muzaffarabad", dinner: "Rice, chicken salan and salad at the guest house" },
      },
      {
        title: "Keran to Sharda and Kel",
        route: "Keran to Sharda to Kel",
        drive: "About 3 to 4 hours",
        activities: ["Stop at Kutton waterfall on the way", "Visit Sharda town and the old Sharda Peeth ruins", "Walk across the Sharda suspension bridge", "Reach Kel in the afternoon"],
        stay: "Family guest house in Kel",
        meals: { breakfast: "Paratha, omelette and chai", lunch: "Neelum river trout with rice in Sharda", dinner: "Mutton or chicken karahi with roti" },
      },
      {
        title: "Arang Kel day",
        route: "Kel to Arang Kel and back",
        drive: "Short drive plus chairlift",
        activities: ["Chairlift across the river from Kel", "Gentle walk up to the Arang Kel meadow (ponies for elders and children)", "Picnic among the wooden houses", "Return to Kel for the evening"],
        stay: "Family guest house in Kel",
        meals: { breakfast: "Halwa puri or paratha and chai", lunch: "Packed picnic: sandwiches, fruit and juice", dinner: "BBQ chicken tikka and naan" },
      },
      {
        title: "Kel to home",
        route: "Kel to Muzaffarabad to Kotli / Mirpur",
        drive: "About 9 hours with stops",
        activities: ["Early start after breakfast", "Lunch break in Muzaffarabad", "Drop off at your home in the evening"],
        stay: "Home",
        meals: { breakfast: "Paratha, eggs and chai", lunch: "Biryani or karahi in Muzaffarabad", dinner: "At home" },
      },
    ],
    included,
    notIncluded,
    bring: bringMountains,
    goodToKnow: [
      "Mobile signal is weak after Keran. JD's team keeps in touch through the driver.",
      "The Arang Kel walk is steep in places. Ponies are available for elders and young children.",
      "Some areas are close to the Line of Control. Always follow the driver's guidance.",
    ],
  },
  {
    slug: "poonch-weekend",
    title: "Poonch Weekend: Banjosa and Toli Pir",
    region: "Azad Jammu Kashmir",
    days: 2,
    nights: 1,
    groupSize: groupVan,
    bestTime: "All year. Snow on Toli Pir from December to February.",
    startFrom: pickup,
    vehicle: "Toyota HiAce, Grand Cabin or a car for small families",
    image: "/media/ig/banjosa-photo.webp",
    photos: ["/media/stock/tolipir.webp", "/media/reels/lasdana.webp", "/media/ig/hajira.webp", "/media/ig/lasdanasnow.webp"],
    overview:
      "A short and easy break close to home. Pine forests and a calm lake at Banjosa, then the wide open meadows of Toli Pir with views across Poonch.",
    highlights: ["Boating at Banjosa lake", "Pine forest walks", "Sunrise on Toli Pir", "Rawalakot bazaar"],
    itinerary: [
      {
        title: "Home to Banjosa",
        route: "Kotli / Khuiratta to Hajira to Rawalakot to Banjosa",
        drive: "About 3 to 4 hours",
        activities: ["Morning pickup", "Tea stop in Hajira", "Boating and a walk around Banjosa lake", "Evening bonfire (weather allowing)"],
        stay: "Family rooms near Banjosa lake",
        meals: { breakfast: "At home before pickup", lunch: "Chicken karahi in Rawalakot", dinner: "BBQ and roti by the lake" },
      },
      {
        title: "Toli Pir and back home",
        route: "Banjosa to Toli Pir to home",
        drive: "About 5 hours with stops",
        activities: ["Early drive up to Toli Pir for the views", "Walk across the meadows and take family photos", "Shopping in Rawalakot bazaar", "Drop off at home in the evening"],
        stay: "Home",
        meals: { breakfast: "Paratha, omelette and kashmiri chai", lunch: "Daal chawal and salan in Rawalakot", dinner: "At home" },
      },
    ],
    included,
    notIncluded,
    bring: bringMountains,
    goodToKnow: ["Toli Pir gets cold and windy even in summer. Bring a warm layer.", "A great first trip for families who have just arrived from the UK."],
  },
  {
    slug: "hunza-skardu",
    title: "Hunza and Skardu Grand Tour",
    region: "Gilgit-Baltistan",
    days: 8,
    nights: 7,
    groupSize: groupVan,
    bestTime: "May to October",
    startFrom: pickup,
    vehicle: "Toyota HiAce or Prado TX for comfort on long drives",
    image: "/media/ig/kachura.webp",
    photos: ["/media/stock/attabad.webp", "/media/ig/shangrila.webp", "/media/ig/chunda.webp", "/media/ig/bashu-photo.webp"],
    overview:
      "The trip of a lifetime along the Karakoram Highway. Ancient forts and turquoise Attabad lake in Hunza, then the lakes and cold desert of Skardu.",
    highlights: ["Karakoram Highway and the Rakaposhi viewpoint", "Baltit and Altit forts", "Attabad lake and the Passu cones", "Shangrila and Upper Kachura lakes", "Katpana cold desert"],
    itinerary: [
      {
        title: "Home to Chilas",
        route: "Kotli / Mirpur to Islamabad to Naran and Babusar to Chilas",
        drive: "About 12 hours",
        activities: ["Very early pickup", "Breakfast on the motorway", "Babusar top views (summer only)", "Night stop in Chilas"],
        stay: "Hotel in Chilas",
        meals: { breakfast: "Motorway rest area", lunch: "Trout or karahi in Naran", dinner: "At the hotel in Chilas" },
      },
      {
        title: "Chilas to Hunza",
        route: "Chilas to Gilgit to Karimabad, Hunza",
        drive: "About 6 to 7 hours",
        activities: ["Nanga Parbat viewpoint", "Meeting point of three mountain ranges", "Rakaposhi viewpoint tea stop", "Sunset in Karimabad"],
        stay: "Family hotel in Karimabad",
        meals: { breakfast: "Paratha and eggs", lunch: "Chicken karahi in Gilgit", dinner: "Hunza local food: chapshoro and daudo soup" },
      },
      {
        title: "Hunza forts and Eagle's Nest",
        route: "Karimabad, Altit and Duikar",
        activities: ["Baltit Fort and Altit Fort", "Walk through the old Karimabad bazaar", "Apricot cake and walnut cake at local cafes", "Sunset at Eagle's Nest"],
        stay: "Family hotel in Karimabad",
        meals: { breakfast: "Hunza bread and omelette", lunch: "Local cafe in Karimabad", dinner: "BBQ and rice" },
      },
      {
        title: "Attabad lake and Passu",
        route: "Karimabad to Attabad lake to Passu and back",
        drive: "About 3 hours return",
        activities: ["Boat ride on Attabad lake", "Passu cones viewpoint", "Hussaini suspension bridge (for the brave)", "Optional drive towards Khunjerab"],
        stay: "Family hotel in Karimabad",
        meals: { breakfast: "Paratha and chai", lunch: "Trout by Attabad lake", dinner: "Karahi and naan" },
      },
      {
        title: "Hunza to Skardu",
        route: "Hunza to Gilgit to Skardu",
        drive: "About 8 hours",
        activities: ["Scenic Skardu road along the Indus river", "Tea stops on the way", "Evening in Skardu bazaar"],
        stay: "Hotel in Skardu",
        meals: { breakfast: "At the hotel", lunch: "Roadside dhaba", dinner: "Chicken handi and roti" },
      },
      {
        title: "Skardu lakes",
        route: "Shangrila, Upper Kachura and Katpana",
        activities: ["Shangrila (Lower Kachura) lake", "Upper Kachura lake and its clear blue water", "Sunset in the Katpana cold desert"],
        stay: "Hotel in Skardu",
        meals: { breakfast: "Paratha and eggs", lunch: "Trout at Shangrila", dinner: "BBQ in Skardu" },
      },
      {
        title: "Skardu to Chilas",
        route: "Skardu to Chilas",
        drive: "About 8 hours",
        activities: ["Morning drive back along the Indus", "Rest and dinner in Chilas"],
        stay: "Hotel in Chilas",
        meals: { breakfast: "At the hotel", lunch: "Roadside dhaba", dinner: "At the hotel" },
      },
      {
        title: "Chilas to home",
        route: "Chilas to Babusar to Islamabad to home",
        drive: "About 12 hours",
        activities: ["Early start", "Lunch in Naran", "Drop off at your home late evening"],
        stay: "Home",
        meals: { breakfast: "At the hotel", lunch: "Naran", dinner: "Motorway or home" },
      },
    ],
    included,
    notIncluded,
    bring: [...bringMountains, "Warmer clothes for Skardu evenings"],
    goodToKnow: [
      "Long drives on mountain roads. JD plans regular stops for elders and children.",
      "Babusar pass is open roughly June to October. Outside that, the route goes via Besham and adds a day.",
      "Weather and landslides can change the plan. Safety always comes first.",
    ],
  },
  {
    slug: "swat-kalam",
    title: "Swat and Kalam",
    region: "Khyber Pakhtunkhwa",
    days: 5,
    nights: 4,
    groupSize: groupVan,
    bestTime: "April to October for Kalam. December to February for snow at Malam Jabba.",
    startFrom: pickup,
    vehicle: "Toyota HiAce or Grand Cabin. Jeep for Mahodand lake.",
    image: "/media/ig/kalam2.webp",
    photos: ["/media/ig/kalam.webp", "/media/stock/malamjabba.webp", "/media/stock/swat.webp"],
    overview: "Rivers, waterfalls and easy roads. Known as the Switzerland of the east, Swat is perfect for elders and young children.",
    highlights: ["Malam Jabba chairlift", "Swat river in Bahrain", "Kalam and Ushu forest", "Mahodand lake by jeep"],
    itinerary: [
      {
        title: "Home to Swat",
        route: "Kotli / Mirpur to Islamabad to Swat motorway to Mingora",
        drive: "About 7 hours",
        activities: ["Morning pickup", "Swat motorway with tunnel views", "Evening by the Swat river in Fizagat"],
        stay: "Hotel in Mingora or Fizagat",
        meals: { breakfast: "At home before pickup", lunch: "Motorway rest area", dinner: "Chapli kabab and karahi" },
      },
      {
        title: "Malam Jabba",
        route: "Mingora to Malam Jabba and back",
        drive: "About 1.5 hours each way",
        activities: ["Chairlift and hilltop views", "Snow play in winter, green slopes in summer", "Fizagat park in the evening"],
        stay: "Hotel in Mingora or Fizagat",
        meals: { breakfast: "Paratha and eggs", lunch: "At Malam Jabba", dinner: "Trout fish fry" },
      },
      {
        title: "Mingora to Kalam",
        route: "Mingora to Bahrain to Kalam",
        drive: "About 3 hours",
        activities: ["Stop at Bahrain by the river", "Walk on the Bahrain suspension bridge", "Evening in Kalam bazaar"],
        stay: "Riverside hotel in Kalam",
        meals: { breakfast: "At the hotel", lunch: "Trout in Bahrain", dinner: "Chicken karahi" },
      },
      {
        title: "Mahodand lake and Ushu forest",
        route: "Kalam to Mahodand lake and back",
        drive: "About 2 hours each way by jeep",
        activities: ["Ushu forest stop", "Boating at Mahodand lake", "Picnic by the lake"],
        stay: "Riverside hotel in Kalam",
        meals: { breakfast: "Paratha and chai", lunch: "Picnic or trout at the lake", dinner: "BBQ and naan" },
      },
      {
        title: "Kalam to home",
        route: "Kalam to Mingora to home",
        drive: "About 9 hours",
        activities: ["Early start", "Lunch in Mingora", "Drop off at home"],
        stay: "Home",
        meals: { breakfast: "At the hotel", lunch: "Mingora", dinner: "At home" },
      },
    ],
    included,
    notIncluded,
    bring: bringMountains,
    goodToKnow: ["Kalam evenings are cold even in summer.", "The Mahodand road needs a jeep; JD arranges it locally."],
  },
  {
    slug: "naran-kaghan",
    title: "Naran, Kaghan and Babusar",
    region: "Khyber Pakhtunkhwa",
    days: 4,
    nights: 3,
    groupSize: groupVan,
    bestTime: "June to September (Babusar pass open)",
    startFrom: pickup,
    vehicle: "Toyota HiAce or Grand Cabin. Jeep for Saif ul Malook.",
    image: "/media/stock/naran.webp",
    photos: ["/media/stock/nathiagali.webp", "/media/ig/minimarg.webp"],
    overview: "Famous lakes and high mountain passes. Saif ul Malook, Lulusar and the drive to Babusar top.",
    highlights: ["Saif ul Malook lake", "Lulusar lake", "Babusar top", "Kunhar river"],
    itinerary: [
      {
        title: "Home to Naran",
        route: "Kotli / Mirpur to Abbottabad to Balakot to Naran",
        drive: "About 8 hours",
        activities: ["Morning pickup", "Lunch in Balakot by the Kunhar river", "Evening walk in Naran bazaar"],
        stay: "Hotel in Naran",
        meals: { breakfast: "At home", lunch: "Balakot", dinner: "Trout and karahi" },
      },
      {
        title: "Saif ul Malook",
        route: "Naran to Saif ul Malook and back",
        drive: "About 1 hour each way by jeep",
        activities: ["Jeep ride to the lake", "Boating and pony rides", "Afternoon rest by the river"],
        stay: "Hotel in Naran",
        meals: { breakfast: "Paratha and chai", lunch: "At the lake", dinner: "BBQ" },
      },
      {
        title: "Lulusar and Babusar top",
        route: "Naran to Batakundi to Lulusar to Babusar top",
        drive: "About 2.5 hours each way",
        activities: ["Batakundi meadows", "Lulusar lake", "Snow and views at Babusar top"],
        stay: "Hotel in Naran",
        meals: { breakfast: "At the hotel", lunch: "Roadside cafe at Babusar", dinner: "Chicken handi" },
      },
      {
        title: "Naran to home",
        route: "Naran to Balakot to home",
        drive: "About 8 hours",
        activities: ["Morning departure", "Lunch in Balakot", "Drop off at home"],
        stay: "Home",
        meals: { breakfast: "At the hotel", lunch: "Balakot", dinner: "At home" },
      },
    ],
    included,
    notIncluded,
    bring: bringMountains,
    goodToKnow: ["Naran hotels are busy in July and August, so book early.", "Babusar top is at about 4,100 m. Take it slow if anyone feels unwell."],
  },
  {
    slug: "islamabad-lahore",
    title: "Islamabad and Lahore City Break",
    region: "Cities",
    days: 3,
    nights: 2,
    groupSize: groupVan,
    bestTime: "October to March (cooler weather)",
    startFrom: pickup,
    vehicle: "Toyota HiAce, Grand Cabin, Corolla or Civic",
    image: "/media/ig/faisal.webp",
    photos: ["/media/ig/lahore.webp", "/media/stock/lahore.webp", "/media/ig/islamabad_r.webp"],
    overview: "History, food and shopping. Faisal Mosque and the Margalla hills in Islamabad, then the Walled City and food streets of Lahore.",
    highlights: ["Faisal Mosque", "Daman-e-Koh viewpoint", "Badshahi Mosque and Lahore Fort", "Food street dinner", "Walled City and shopping"],
    itinerary: [
      {
        title: "Islamabad",
        route: "Home to Islamabad",
        drive: "About 2.5 to 3 hours",
        activities: ["Faisal Mosque", "Pakistan Monument", "Daman-e-Koh viewpoint", "Dinner in the Margalla hills"],
        stay: "Hotel in Islamabad",
        meals: { breakfast: "At home", lunch: "Desi food in F-7 or Blue Area", dinner: "Hilltop restaurant in the Margalla hills" },
      },
      {
        title: "Lahore",
        route: "Islamabad to Lahore by motorway",
        drive: "About 4.5 hours",
        activities: ["Badshahi Mosque", "Lahore Fort", "Minar-e-Pakistan", "Dinner at Fort Road food street"],
        stay: "Hotel in Lahore",
        meals: { breakfast: "At the hotel", lunch: "Motorway rest area", dinner: "Lahori karahi, tikka and lassi" },
      },
      {
        title: "Walled City and home",
        route: "Lahore to home",
        drive: "About 5 hours",
        activities: ["Walk in the Walled City and Wazir Khan Mosque", "Shopping in Anarkali or Liberty", "Drive home"],
        stay: "Home",
        meals: { breakfast: "Halwa puri and lassi", lunch: "Biryani or nihari", dinner: "At home" },
      },
    ],
    included,
    notIncluded,
    bring: ["Comfortable shoes", "Light clothes (cotton in summer)", "Modest clothing for mosque visits", "CNIC or NICOP copies"],
    goodToKnow: ["Friday prayers change mosque visiting times.", "Lahore summers are very hot. October to March is the best time."],
  },
  {
    slug: "karachi",
    title: "Karachi by the Sea",
    region: "Cities",
    days: 3,
    nights: 2,
    groupSize: "2 to 14 people. JD's team arranges a van in Karachi.",
    bestTime: "November to February",
    startFrom: "Travel to Karachi by overnight train or as your family prefers. JD's team meets you in Karachi.",
    vehicle: "Toyota HiAce or a car in Karachi",
    image: "/media/stock/karachi.webp",
    photos: [],
    overview: "Pakistan's biggest city by the Arabian Sea: the Quaid's resting place, beaches and the best seafood in the country.",
    highlights: ["Mazar-e-Quaid", "Clifton and Sea View beach", "Do Darya seafood dinner", "Port Grand", "Shopping at Dolmen Mall and Zainab Market"],
    itinerary: [
      {
        title: "Arrive and explore",
        route: "Around Karachi",
        activities: ["Meet JD's team", "Mazar-e-Quaid", "Frere Hall", "Evening at Port Grand"],
        stay: "Hotel in Clifton or Saddar",
        meals: { breakfast: "On arrival", lunch: "Karachi biryani", dinner: "BBQ at Port Grand" },
      },
      {
        title: "Beach day",
        route: "Clifton, Sea View and Do Darya",
        activities: ["Camel rides at Sea View beach", "Mohatta Palace", "Seafood dinner at Do Darya by the sea"],
        stay: "Hotel in Clifton or Saddar",
        meals: { breakfast: "At the hotel", lunch: "Burns Road food street", dinner: "Seafood at Do Darya" },
      },
      {
        title: "Shopping and departure",
        route: "Karachi",
        activities: ["Dolmen Mall or Zainab Market", "Empress Market", "Depart for home"],
        stay: "Home",
        meals: { breakfast: "At the hotel", lunch: "Nihari on Burns Road", dinner: "On the way" },
      },
    ],
    included: ["Van with driver in Karachi", "Hotel rooms for every night", "Breakfast every day", "JD on WhatsApp for the whole trip"],
    notIncluded: ["Travel to and from Karachi", ...notIncluded],
    bring: ["Light cotton clothes", "Sun cream and sunglasses", "CNIC or NICOP copies"],
    goodToKnow: ["Karachi is hot and humid from April to October."],
  },
];

export const getTripPlan = (slug: string) => tripPlans.find((t) => t.slug === slug);
