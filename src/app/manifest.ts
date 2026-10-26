import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JD Travels",
    short_name: "JD Travels",
    description: "Family trips to Azad Jammu Kashmir, Gilgit-Baltistan and Swat.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#0f3d2e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
