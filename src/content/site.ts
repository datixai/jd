// All editable text for the site lives here.

export type Scene = "valley" | "lake" | "peaks" | "forest" | "meadow" | "river";

export const contact = {
  name: "Junaid Shazad",
  phoneDisplay: "+92 310 9441906",
  phoneTel: "+923109441906",
  whatsapp: "923109441906",
  instagram: "https://www.instagram.com/jds_wonders",
  instagramHandle: "@jds_wonders",
  facebook: "https://www.facebook.com/share/1BK4EomN7s/",
  vehiclesUrl: "https://friends-motors-web.vercel.app/booking",
};

export type Contact = typeof contact;

export const waLink = (whatsapp: string, text: string) =>
  `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Trips", href: "/trips" },
  { label: "Vehicles", href: "/#vehicles" },
  { label: "For families", href: "/#families" },
  { label: "Gallery", href: "/#gallery" },
  { label: "FAQ", href: "/#faq" },
];

export type Hero = { eyebrow: string; title: string; tagline: string; text: string };

export const hero: Hero = {
  eyebrow: "For Kotli, Khuiratta, Dadyal and Mirpur families in Bolton, the UK and abroad",
  title: "Home for the holidays. Now see the valleys.",
  tagline: "Apni wadiyan, apne log.",
  text: "Coming back from the UK or abroad? JD plans the whole trip for your family: pickup, van, hotels, food and the best views in Azad Jammu Kashmir, Gilgit-Baltistan and Swat.",
};

export const intro = {
  title: "You come home every year. When did you last see Neelum?",
  text: [
    "Most families visiting from Bolton, Birmingham, Bradford, Luton or Manchester spend the trip between weddings and relatives. The mountains are only a few hours away, but planning a safe trip with elders and children feels like too much.",
    "That is where JD comes in. Junaid is from the area, knows the roads, the drivers and the hotels, and runs trips that are made for families. You tell him the dates, he handles the rest.",
  ],
};

export type Place = { name: string; text: string; scene: Scene; image?: string };
export type Region = { id: string; label: string; intro: string; places: Place[] };

export const regions: Region[] = [
  {
    id: "ajk",
    label: "Azad Jammu Kashmir",
    intro: "Close to home and full of green valleys, rivers and cool hill stations. Perfect for a short family break.",
    places: [
      { name: "Neelum Valley", text: "Keran, Sharda, Kel and Arang Kel along the blue Neelum river.", scene: "river", image: "/media/reels/neelum.webp" },
      { name: "Arang Kel", text: "A meadow village above Kel, reached by chairlift over the Neelum river.", scene: "meadow", image: "/media/reels/arangkel.webp" },
      { name: "Sharda", text: "Wooden houses, snow peaks and the old Sharda Peeth ruins.", scene: "valley", image: "/media/ig/sharda.webp" },
      { name: "Leepa Valley", text: "Rice terraces and wooden villages in a quiet hidden valley.", scene: "valley", image: "/media/ig/leepa2.webp" },
      { name: "Banjosa Lake", text: "A calm lake in the pine forests of Rawalakot, Poonch.", scene: "lake", image: "/media/ig/banjosa-photo.webp" },
      { name: "Toli Pir", text: "Wide open meadows on top of Poonch with views for miles.", scene: "meadow", image: "/media/stock/tolipir.webp" },
      { name: "Ganga Choti, Bagh", text: "A mountain ridge above Bagh with snow and sweeping views.", scene: "peaks", image: "/media/ig/gangachoti.webp" },
      { name: "Lasdana, Bagh", text: "Pine forest roads, snow in winter and cool green meadows in summer.", scene: "forest", image: "/media/ig/lasdanasnow.webp" },
    ],
  },
  {
    id: "gb",
    label: "Gilgit-Baltistan",
    intro: "The big mountains. Glaciers, turquoise lakes and the Karakoram Highway, for families ready for a longer trip.",
    places: [
      { name: "Hunza", text: "Karimabad, Altit and Baltit forts, Attabad lake and Passu cones.", scene: "peaks", image: "/media/stock/hunza.webp" },
      { name: "Upper Kachura Lake", text: "Crystal clear blue water surrounded by mountains in Skardu.", scene: "lake", image: "/media/ig/kachura.webp" },
      { name: "Shangrila, Skardu", text: "The famous lake and resort at Lower Kachura.", scene: "lake", image: "/media/ig/shangrila.webp" },
      { name: "Bashu Valley", text: "Green meadows and forests above Skardu.", scene: "meadow", image: "/media/ig/bashu-photo.webp" },
      { name: "Rainbow Lake, Minimarg", text: "A colourful lake in the remote meadows of Minimarg, Astore.", scene: "lake", image: "/media/ig/rainbowlake.webp" },
      { name: "Fairy Meadows", text: "A green meadow with Nanga Parbat right in front of you.", scene: "peaks", image: "/media/stock/fairymeadows.webp" },
    ],
  },
  {
    id: "kp",
    label: "Swat and KP",
    intro: "The Switzerland of the east. Rivers, waterfalls and easy roads, great for elders and young children.",
    places: [
      { name: "Kalam", text: "A river valley with the Ushu forest and Mahodand lake.", scene: "lake", image: "/media/ig/kalam.webp" },
      { name: "Malam Jabba", text: "Chairlift and hill top views, snow in winter.", scene: "peaks", image: "/media/stock/malamjabba.webp" },
      { name: "Naran and Kaghan", text: "Saif ul Malook lake and the Babusar top drive.", scene: "valley", image: "/media/stock/naran.webp" },
      { name: "Murree and Nathia Gali", text: "A quick hill station escape near Islamabad.", scene: "forest", image: "/media/stock/nathiagali.webp" },
    ],
  },
  {
    id: "cities",
    label: "Cities",
    intro: "Big city days for shopping, food and history, easy to add before or after the mountains.",
    places: [
      { name: "Islamabad", text: "Faisal Mosque, Daman-e-Koh and dinner in the Margalla hills.", scene: "forest", image: "/media/ig/faisal.webp" },
      { name: "Lahore", text: "Badshahi Mosque, the Walled City and the famous food streets.", scene: "meadow", image: "/media/stock/lahore.webp" },
      { name: "Karachi", text: "Clifton beach, Mazar-e-Quaid and seafood by the sea.", scene: "lake", image: "/media/stock/karachi.webp" },
      { name: "Muzaffarabad", text: "The capital of Azad Jammu Kashmir where two rivers meet.", scene: "river", image: "/media/ig/muzaffarabad.webp" },
    ],
  },
];

export type Trip = { slug?: string; title: string; days: string; region: string; highlights: string[]; scene: Scene; image?: string };

export const trips: Trip[] = [
  { slug: "neelum-valley", title: "Neelum Valley Family Escape", days: "4 days", region: "Azad Jammu Kashmir", highlights: ["Keran and Sharda", "Arang Kel chairlift", "Riverside stays"], scene: "river", image: "/media/reels/arangkel.webp" },
  { slug: "poonch-weekend", title: "Poonch Weekend", days: "2 days", region: "Azad Jammu Kashmir", highlights: ["Banjosa lake", "Toli Pir", "Lasdana"], scene: "meadow", image: "/media/ig/banjosa-photo.webp" },
  { slug: "hunza-skardu", title: "Hunza and Skardu Grand Tour", days: "8 days", region: "Gilgit-Baltistan", highlights: ["Attabad lake", "Passu cones", "Shangrila"], scene: "peaks", image: "/media/ig/kachura.webp" },
  { slug: "swat-kalam", title: "Swat and Kalam", days: "5 days", region: "Khyber Pakhtunkhwa", highlights: ["Mahodand lake", "Malam Jabba", "Swat river"], scene: "lake", image: "/media/ig/kalam2.webp" },
  { slug: "naran-kaghan", title: "Naran, Kaghan and Babusar", days: "4 days", region: "Khyber Pakhtunkhwa", highlights: ["Saif ul Malook", "Lulusar lake", "Babusar top"], scene: "valley", image: "/media/stock/naran.webp" },
  { slug: "islamabad-lahore", title: "Islamabad and Lahore City Break", days: "3 days", region: "Cities", highlights: ["Faisal Mosque", "Badshahi Mosque", "Food streets"], scene: "forest", image: "/media/ig/faisal.webp" },
  { slug: "karachi", title: "Karachi by the Sea", days: "3 days", region: "Cities", highlights: ["Clifton beach", "Mazar-e-Quaid", "Port Grand"], scene: "lake", image: "/media/stock/karachi.webp" },
  { title: "Custom family trip", days: "Your dates", region: "Anywhere", highlights: ["Your route", "Your group size", "Your budget"], scene: "forest", image: "/media/reels/kail.webp" },
];

export const families = {
  title: "Made for families visiting from abroad",
  text: "Already home in Kotli, Khuiratta, Dadyal or Mirpur? JD plans around your family, your dates and your elders, and picks you up from your door.",
  points: [
    { title: "Pickup from your home", text: "Kotli, Khuiratta, Dadyal, Mirpur and the villages around them." },
    { title: "Comfortable family vans", text: "Clean vehicles with experienced local drivers who know the mountain roads." },
    { title: "Elders and kids friendly", text: "Easy routes, regular stops and hotels with family rooms." },
    { title: "Halal food and good hotels", text: "Checked stays and trusted places to eat on every route." },
    { title: "One contact on WhatsApp", text: "Plan from the UK before you fly. JD is one message away during the trip." },
    { title: "Private or group trips", text: "Just your family, or join a group of families from the area." },
  ],
  pickups: ["Kotli", "Khuiratta", "Dadyal", "Mirpur"],
};

export const steps = [
  { title: "Send a message", text: "Tell JD your dates, how many people and where you would like to go." },
  { title: "Get your plan", text: "JD sends a route, hotels and a clear price for your family." },
  { title: "Confirm", text: "Book before you fly, so everything is ready when you land." },
  { title: "Enjoy the trip", text: "Pickup from your door. Relax, JD and the team handle the rest." },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  { q: "We live in Bolton (or elsewhere in the UK). Can we plan before we fly?", a: "Yes. Most families plan on WhatsApp a few weeks before they travel, so the trip is ready when they arrive." },
  { q: "Can you pick us up from our village?", a: "Yes. Pickups are available from Kotli, Khuiratta, Dadyal, Mirpur and nearby villages." },
  { q: "Is it safe for elders and small children?", a: "Trips are planned for families, with experienced drivers, regular rest stops and family friendly hotels." },
  { q: "When is the best time to visit?", a: "May to October is best for Neelum, Hunza and Skardu. Swat, Murree and Malam Jabba are also lovely in winter for snow." },
  { q: "How much does a trip cost?", a: "It depends on the route, days, group size and hotels. Send a message and JD will give you a clear price." },
  { q: "Can we make our own trip?", a: "Yes. Every trip can be changed, or JD can build one from scratch around your family." },
];

export const reels = [
  { file: "reels/neelum", title: "Neelum Valley" },
  { file: "reels/arangkel", title: "Arang Kel" },
  { file: "ig/gurez", title: "Gurez, Neelum" },
  { file: "ig/neelum2", title: "Neelum river" },
  { file: "reels/kail", title: "Kel, Neelum" },
  { file: "ig/banjosa", title: "Banjosa Lake" },
  { file: "ig/pirkanthi", title: "Pir Kanthi" },
  { file: "ig/hajira", title: "Hajira, Poonch" },
  { file: "ig/bagh", title: "Bagh" },
  { file: "reels/lasdana", title: "Lasdana, Bagh" },
  { file: "ig/khurshidabad", title: "Khurshidabad Haveli" },
  { file: "ig/thill", title: "Thill, Khuiratta" },
  { file: "ig/karjai", title: "Qila Karjai, Khuiratta" },
  { file: "ig/kotliriver", title: "Kotli" },
  { file: "reels/kotli", title: "Kotli city" },
  { file: "reels/mirpur", title: "Mirpur" },
  { file: "ig/bashu", title: "Bashu Valley, Skardu" },
  { file: "reels/valley", title: "Kashmir valley" },
  { file: "reels/winter", title: "Kashmir in winter" },
  { file: "ig/lasdanawinter", title: "Lasdana in winter" },
  { file: "ig/nature", title: "Kashmir streams" },
  { file: "ig/lasdana2", title: "Lasdana forest" },
  { file: "ig/sehnsa", title: "Sehnsa" },
  { file: "ig/havelikahuta", title: "Haveli Kahuta" },
  { file: "ig/hajira2", title: "Hajira hills" },
  { file: "ig/nakyal", title: "Nakyal" },
  { file: "ig/brali", title: "Brali, Kotli" },
  { file: "ig/kotlibridge", title: "Kotli bridge" },
  { file: "ig/khuiratta_r1", title: "Khuiratta" },
  { file: "ig/khuiratta_r2", title: "Khuiratta hills" },
  { file: "ig/oneclick", title: "Kashmir in one click" },
  { file: "ig/islamabad_r", title: "Islamabad" },
];

// JD's photos for the photo gallery
export const photos = [
  { file: "ig/kachura", title: "Upper Kachura Lake, Skardu" },
  { file: "ig/banjosa-photo", title: "Banjosa Lake" },
  { file: "ig/bashu-photo", title: "Bashu Valley, Skardu" },
  { file: "ig/leepa2", title: "Leepa Valley" },
  { file: "ig/sharda", title: "Sharda, Neelum" },
  { file: "ig/rainbowlake", title: "Rainbow Lake, Minimarg" },
  { file: "ig/shangrila", title: "Shangrila, Skardu" },
  { file: "ig/chunda", title: "Chunda Valley, Skardu" },
  { file: "ig/minimarg", title: "Minimarg, Astore" },
  { file: "ig/leepa", title: "Leepa Valley road" },
  { file: "ig/kalam", title: "Kalam, Swat" },
  { file: "ig/kalam2", title: "Kalam village" },
  { file: "ig/gangachoti2", title: "Ganga Choti" },
  { file: "ig/lasdanasnow2", title: "Lasdana in snow" },
  { file: "ig/khuiratta", title: "Khuiratta after the rain" },
  { file: "ig/khuiratta2", title: "Khuiratta in snow" },
  { file: "ig/kotli", title: "Kotli" },
  { file: "ig/haveli", title: "Haveli" },
  { file: "ig/muzaffarabad", title: "Muzaffarabad" },
  { file: "ig/lahore", title: "Lahore" },
];

export type Vehicle = { name: string; type: string; seats: string; best: string; icon: "van" | "car" | "suv" | "jeep"; image: string };

export const vehicles: Vehicle[] = [
  { name: "Toyota HiAce", type: "Family van", seats: "Up to 14", best: "Big families and group trips", icon: "van", image: "/media/stock/hiace.webp" },
  { name: "Toyota Grand Cabin", type: "Van", seats: "Up to 10", best: "Long drives in comfort", icon: "van", image: "/media/stock/grandcabin.webp" },
  { name: "Toyota Corolla", type: "Car", seats: "4", best: "Small families and city trips", icon: "car", image: "/media/stock/corolla.webp" },
  { name: "Honda Civic", type: "Car", seats: "4", best: "Comfortable city and highway drives", icon: "car", image: "/media/stock/civic.webp" },
  { name: "Family MPV", type: "Mini van", seats: "6 to 7", best: "Suzuki APV, Every or similar for short trips around AJK", icon: "van", image: "/media/stock/apv.webp" },
  { name: "Toyota Prado TX", type: "Luxury 4x4", seats: "7", best: "Luxury trips on any road", icon: "suv", image: "/media/stock/prado.webp" },
  { name: "Toyota Land Cruiser", type: "Luxury 4x4", seats: "7", best: "VIP and wedding guests", icon: "suv", image: "/media/stock/landcruiser.webp" },
  { name: "Toyota Hilux Revo 4x4", type: "4x4 pickup", seats: "4", best: "Mountain roads in Neelum and Leepa", icon: "jeep", image: "/media/stock/hilux.webp" },
  { name: "Mountain jeep", type: "Jeep", seats: "6", best: "Rough tracks like Ratti Gali and Taobat", icon: "jeep", image: "/media/stock/jeep.webp" },
];

export type SiteContent = { hero: Hero; contact: Contact; trips: Trip[]; faqs: Faq[] };
