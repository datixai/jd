"use client";

import { useState } from "react";
import { ReelCard } from "./client";

type Item = { file: string; title: string };

function MoreButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <div className="mt-8 text-center">
      <button onClick={onClick} className="rounded-full border border-pine px-6 py-3 font-semibold text-pine transition hover:bg-pine hover:text-white">
        {label}
      </button>
    </div>
  );
}

export function Gallery({ reels, photos }: { reels: Item[]; photos: Item[] }) {
  const [allReels, setAllReels] = useState(false);
  const [allPhotos, setAllPhotos] = useState(false);
  const shownReels = allReels ? reels : reels.slice(0, 8);
  const shownPhotos = allPhotos ? photos : photos.slice(0, 8);

  return (
    <>
      <h3 className="mb-6 text-center text-2xl font-semibold text-pine">Videos</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shownReels.map((r) => (
          <ReelCard key={r.file} video={`/media/${r.file}.mp4`} poster={`/media/${r.file}.webp`} title={r.title} />
        ))}
      </div>
      {!allReels && reels.length > 8 && <MoreButton onClick={() => setAllReels(true)} label={`Show all ${reels.length} videos`} />}

      <h3 className="mt-16 mb-6 text-center text-2xl font-semibold text-pine">Photos</h3>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {shownPhotos.map((p) => (
          <figure key={p.file} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[18px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${p.file}.webp`} alt={p.title} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
              {p.title}
            </figcaption>
          </figure>
        ))}
      </div>
      {!allPhotos && photos.length > 8 && <MoreButton onClick={() => setAllPhotos(true)} label={`Show all ${photos.length} photos`} />}
    </>
  );
}
