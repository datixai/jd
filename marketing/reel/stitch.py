"""Stitch the per-screen captures into one tall image per page."""
import json, os
from PIL import Image
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "work", "shots")
for name in ["home", "trips", "trip"]:
    meta = json.load(open(os.path.join(D, name + ".json")))
    out = Image.new("RGB", (780, int(meta["height"] * 2)), "white")
    for t in meta["tiles"]:
        out.paste(Image.open(os.path.join(D, name, t["file"])).convert("RGB"), (0, int(t["y"] * 2)))
    out.save(os.path.join(D, name + ".png"))
    print(name, out.size)
