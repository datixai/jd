import { exists } from "@/lib/media";
import type { Scene as SceneName } from "@/content/site";
import { Scene } from "./Scene";

// Shows JD's photo when the file exists in public/media, otherwise a drawn scene.
export function Media({ image, scene, alt, className = "" }: { image?: string; scene: SceneName; alt: string; className?: string }) {
  if (image && exists(image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  return <Scene name={scene} className={`h-full w-full ${className}`} />;
}
