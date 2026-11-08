"""JD Travels promo reel (vertical 1080x1920, 30 fps, about 54 s).

Theme: "the journey home". Dusk pine and saffron colours with drifting topographic contour lines,
a flight path from Bolton to Kotli, polaroid postcards of JD's own photos, a phone showing the real
website, a WhatsApp style planning chat, and a warm synthesised soundtrack (dhol style drums,
plucked rabab style notes, wind and shutter sounds). No links, phone numbers or personal details.

Usage:
  node capture.mjs && python stitch.py      (website captures, needs the site running on :3123)
  python reel.py --preview 2 7 13 20 27 34 40 46 51
  python reel.py                            -> out/jd-travels-reel.mp4
"""
import functools
import json
import math
import os
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
MEDIA = os.path.join(ROOT, "public", "media")
SHOTS = os.path.join(HERE, "work", "shots")
ASSETS = os.path.join(HERE, "assets")
FFMPEG = r"D:\SecretEye\marketing\reel\node_modules\ffmpeg-static\ffmpeg.exe"

W, H, FPS = 1080, 1920, 30
PINE, DARK, DEEP = (15, 61, 46), (10, 42, 32), (6, 26, 20)
SAF, SNOW, LAKE = (233, 162, 59), (247, 243, 234), (43, 111, 138)
TEXT, MUTED, WA = (246, 242, 232), (176, 196, 186), (37, 211, 102)


# ---------------------------------------------------------------- basics
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def back_out(x):
    x = clamp(x)
    c = 1.7
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def ramp(t, a, b):
    return clamp((t - a) / (b - a)) if b > a else float(t >= a)


def A(col, a):
    return tuple(col[:3]) + (round(255 * clamp(a)),)


def mix(c1, c2, p):
    return tuple(round(a + (b - a) * p) for a, b in zip(c1, c2))


@functools.lru_cache(maxsize=64)
def serif(size, italic=False):
    return ImageFont.truetype(r"C:\Windows\Fonts\georgiaz.ttf" if italic else r"C:\Windows\Fonts\georgiab.ttf", size)


@functools.lru_cache(maxsize=64)
def inter(weight, size):
    name = {"regular": "400Regular", "medium": "500Medium", "semibold": "600SemiBold", "bold": "700Bold", "extrabold": "800ExtraBold"}[weight]
    return ImageFont.truetype(os.path.join(ASSETS, "fonts", f"Inter_{name}.ttf"), size)


def rich(d, cx, y, text, fnt, alpha, base=TEXT, accent=SAF):
    """Centered text; words between *stars* are drawn in the accent colour."""
    parts, cur, on = [], "", False
    for ch in text:
        if ch == "*":
            if cur:
                parts.append((cur, on))
            cur, on = "", not on
        else:
            cur += ch
    if cur:
        parts.append((cur, on))
    total = sum(d.textlength(p, font=fnt) for p, _ in parts)
    x = cx - total / 2
    for p, on in parts:
        d.text((x, y), p, font=fnt, fill=A(accent if on else base, alpha), anchor="ls")
        x += d.textlength(p, font=fnt)
    return total


def caption(layer, h1, h2, a, y=250):
    if a <= 0:
        return
    d = ImageDraw.Draw(layer, "RGBA")
    rise = (1 - ease_out(a)) * 30
    w = rich(d, W / 2, y + rise, h1, serif(74), a)
    d.rounded_rectangle([W / 2 - min(w, 520) / 2, y + 26 + rise, W / 2 + min(w, 520) / 2, y + 32 + rise], 3, fill=A(SAF, a))
    d.text((W / 2, y + 92 + rise), h2, font=inter("medium", 38), fill=A(MUTED, a), anchor="ms")


# ---------------------------------------------------------------- background
@functools.lru_cache(maxsize=1)
def base_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    g = (yy / H)[..., None]
    top, bot = np.array(DEEP, np.float32), np.array(PINE, np.float32)
    img = top * (1 - g) + bot * g
    glow = np.exp(-(((xx - W * 0.75) / 700) ** 2 + ((yy - H * 0.08) / 600) ** 2))[..., None]
    img = img + glow * (np.array(SAF, np.float32) - img) * 0.22
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


@functools.lru_cache(maxsize=1)
def contours():
    """Topographic contour lines, taller than the frame so they can drift."""
    hh = H + 600
    yy, xx = np.mgrid[0:hh, 0:W].astype(np.float32)
    f = (np.sin(xx / 210) * np.cos(yy / 260) + 0.6 * np.sin((xx + yy) / 330) + 0.4 * np.cos((xx - 2 * yy) / 420)) * 4
    frac = np.abs(f - np.round(f))
    m = np.clip(1 - frac / 0.035, 0, 1) * 46
    return Image.fromarray(m.astype(np.uint8))


def background(t, tint=None):
    img = base_bg().copy()
    off = int((t * 14) % 600)
    m = contours().crop((0, off, W, off + H))
    img.paste(Image.new("RGB", (W, H), mix(SAF, SNOW, 0.4)), (0, 0), m)
    if tint:
        img = Image.blend(img, Image.new("RGB", (W, H), tint[0]), tint[1])
    return img


# ---------------------------------------------------------------- logo
def draw_mark(layer, cx, cy, size, draw_p=1.0, alpha=1.0):
    """JD Travels mark: rounded pine tile, saffron mountain line (drawn progressively), white JD."""
    s = size / 64
    d = ImageDraw.Draw(layer, "RGBA")
    x0, y0 = cx - size / 2, cy - size / 2
    d.rounded_rectangle([x0, y0, x0 + size, y0 + size], 14 * s, fill=A(PINE, alpha), outline=A(mix(PINE, SNOW, 0.25), alpha), width=max(2, int(s)))
    pts = [(9, 52), (22, 37), (29, 44), (40, 29), (55, 52)]
    segs = [(pts[i], pts[i + 1]) for i in range(4)]
    lens = [math.dist(a, b) for a, b in segs]
    total, left = sum(lens), sum(lens) * clamp(draw_p)
    line = [(x0 + pts[0][0] * s, y0 + pts[0][1] * s)]
    for (a, b), L in zip(segs, lens):
        if left <= 0:
            break
        f = min(1, left / L)
        line.append((x0 + (a[0] + (b[0] - a[0]) * f) * s, y0 + (a[1] + (b[1] - a[1]) * f) * s))
        left -= L
    if len(line) > 1:
        d.line(line, fill=A(SAF, alpha), width=int(4.5 * s), joint="curve")
    if draw_p >= 1:
        d.line([(x0 + 36.6 * s, y0 + 33.6 * s), (x0 + 40 * s, y0 + 29 * s), (x0 + 43.4 * s, y0 + 33.6 * s)], fill=A(SNOW, alpha), width=int(4.5 * s), joint="curve")
    d.text((cx, y0 + 28 * s), "JD", font=serif(int(22 * s)), fill=A(SNOW, alpha * clamp(draw_p * 2 - 0.6)), anchor="ms")


def wordmark(layer, cx, y, size, alpha):
    d = ImageDraw.Draw(layer, "RGBA")
    f = serif(size)
    w1, w2 = d.textlength("JD ", font=f), d.textlength("Travels", font=f)
    x = cx - (w1 + w2) / 2
    d.text((x, y), "JD ", font=f, fill=A(TEXT, alpha), anchor="ls")
    d.text((x + w1, y), "Travels", font=f, fill=A(SAF, alpha), anchor="ls")


@functools.lru_cache(maxsize=1)
def datix_tile():
    dx = Image.open(os.path.join(ASSETS, "datix-logo.png")).convert("RGB").resize((110, 110), Image.LANCZOS)
    m = Image.new("L", (110, 110), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, 109, 109], 26, fill=255)
    tile = Image.new("RGBA", (110, 110), (0, 0, 0, 0))
    tile.paste(dx, (0, 0), m)
    return tile


def datix_credit(layer, y0, c):
    if c <= 0:
        return
    d = ImageDraw.Draw(layer, "RGBA")
    d.line([(W / 2 - 190, y0), (W / 2 + 190, y0)], fill=A(SAF, c * 0.6), width=2)
    d.text((W / 2, y0 + 56), "DEVELOPED BY", font=inter("semibold", 24), fill=A(MUTED, c), anchor="ms")
    fb = inter("extrabold", 58)
    tw = d.textlength("Datix AI", font=fb)
    gx = round(W / 2 - (110 + 26 + tw) / 2)
    tile = datix_tile().copy()
    tile.putalpha(tile.getchannel("A").point(lambda v: round(v * c)))
    layer.paste(tile, (gx, round(y0 + 84)), tile)
    d.text((gx + 136, y0 + 160), "Datix AI", font=fb, fill=A(TEXT, c), anchor="ls")
    d.text((W / 2, y0 + 248), "datixai.com", font=inter("semibold", 30), fill=A(SAF, c), anchor="ms")


# ---------------------------------------------------------------- phone with the real website
@functools.lru_cache(maxsize=4)
def page(name):
    return Image.open(os.path.join(SHOTS, name + ".png")).convert("RGB")


@functools.lru_cache(maxsize=4)
def meta(name):
    return json.load(open(os.path.join(SHOTS, name + ".json")))


@functools.lru_cache(maxsize=1)
def header_img():
    return Image.open(os.path.join(SHOTS, "header.png")).convert("RGB")


SCR_W, SCR_H, STATUS = 600, 1250, 40
PH_X, PH_Y = (W - SCR_W) // 2 - 18, 540


@functools.lru_cache(maxsize=1)
def phone_frame():
    fw, fh = SCR_W + 36, SCR_H + STATUS + 36
    fr = Image.new("RGBA", (fw + 80, fh + 80), (0, 0, 0, 0))
    sh = Image.new("RGBA", fr.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([40, 56, 40 + fw, 56 + fh], 74, fill=(0, 0, 0, 150))
    fr.alpha_composite(sh.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(fr)
    d.rounded_rectangle([40, 40, 40 + fw, 40 + fh], 74, fill=(18, 22, 20, 255), outline=(70, 80, 75, 255), width=3)
    return fr


@functools.lru_cache(maxsize=1)
def screen_mask():
    m = Image.new("L", (SCR_W, SCR_H + STATUS), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, SCR_W - 1, SCR_H + STATUS - 1], 56, fill=255)
    return m


def phone(layer, name, y_css, header=True, alpha=1.0, dy=0):
    """Draw the phone showing page `name` scrolled to y_css (CSS px)."""
    src = page(name)
    top = int(y_css * 2)
    vh = int(SCR_H / SCR_W * 780)
    top = max(0, min(top, src.height - vh))
    view = src.crop((0, top, 780, top + vh)).resize((SCR_W, SCR_H), Image.BILINEAR)
    scr = Image.new("RGB", (SCR_W, SCR_H + STATUS), DEEP)
    scr.paste(view, (0, STATUS))
    if header and y_css > 30:
        hd = header_img().resize((SCR_W, int(SCR_W / 780 * 148)), Image.BILINEAR)
        scr.paste(hd, (0, STATUS))
    d = ImageDraw.Draw(scr)
    d.text((44, 28), "9:41", font=inter("semibold", 22), fill=(240, 240, 240), anchor="ls")
    for i in range(4):
        d.rectangle([SCR_W - 120 + i * 9, 26 - i * 4, SCR_W - 114 + i * 9, 28], fill=(240, 240, 240))
    d.rounded_rectangle([SCR_W - 72, 12, SCR_W - 36, 28], 4, outline=(240, 240, 240), width=2)
    d.rectangle([SCR_W - 69, 15, SCR_W - 45, 25], fill=(240, 240, 240))
    d.rounded_rectangle([SCR_W / 2 - 60, 8, SCR_W / 2 + 60, 32], 12, fill=(0, 0, 0))
    out = phone_frame().copy()
    rgba = scr.convert("RGBA")
    rgba.putalpha(screen_mask())
    out.alpha_composite(rgba, (58, 58))
    if alpha < 1:
        out.putalpha(out.getchannel("A").point(lambda v: round(v * alpha)))
    layer.paste(out, (PH_X - 40, PH_Y - 40 + int(dy)), out)


def scroll_at(u, keys):
    """keys: [(time, y_css)], eased between keys."""
    if u <= keys[0][0]:
        return keys[0][1]
    for (t0, y0), (t1, y1) in zip(keys, keys[1:]):
        if u <= t1:
            return y0 + (y1 - y0) * ease((u - t0) / (t1 - t0))
    return keys[-1][1]


def tap(layer, x, y, u):
    """Touch ripple at screen point (CSS coordinates inside the phone)."""
    if not 0 <= u <= 0.6:
        return
    d = ImageDraw.Draw(layer, "RGBA")
    px, py = PH_X + 18 + x / 390 * SCR_W, PH_Y + 18 + STATUS + y / 390 * SCR_W
    r = 20 + 60 * ease_out(u / 0.6)
    a = 1 - u / 0.6
    d.ellipse([px - r, py - r, px + r, py + r], outline=A(SNOW, a * 0.9), width=4)
    d.ellipse([px - 18, py - 18, px + 18, py + 18], fill=A(SNOW, a * 0.35))


# ---------------------------------------------------------------- photos
@functools.lru_cache(maxsize=16)
def photo(rel, w, h):
    im = Image.open(os.path.join(MEDIA, rel)).convert("RGB")
    r = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
    l, t = (im.width - w) // 2, int((im.height - h) * 0.35)
    return im.crop((l, t, l + w, t + h))


@functools.lru_cache(maxsize=16)
def polaroid(rel, label, angle):
    pw, ph = 500, 560
    card = Image.new("RGBA", (pw + 48, ph + 150), (250, 248, 242, 255))
    card.paste(photo(rel, pw, ph), (24, 24))
    d = ImageDraw.Draw(card)
    d.text((card.width / 2, ph + 108), label, font=serif(46, italic=True), fill=(40, 50, 45), anchor="ms")
    big = Image.new("RGBA", (card.width + 60, card.height + 60), (0, 0, 0, 0))
    sh = Image.new("RGBA", big.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle([34, 40, 34 + card.width, 40 + card.height], fill=(0, 0, 0, 120))
    big.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)))
    big.alpha_composite(card, (30, 30))
    return big.rotate(angle, resample=Image.BICUBIC, expand=True)


# ---------------------------------------------------------------- scenes
def sc_intro(L, u, dur):
    d = ImageDraw.Draw(L, "RGBA")
    draw_mark(L, W / 2, 820, 300, draw_p=ease(ramp(u, 0.2, 1.6)), alpha=ease_out(ramp(u, 0.0, 0.5)))
    a = ease_out(ramp(u, 1.5, 2.2))
    wordmark(L, W / 2, 1090 + (1 - a) * 30, 112, a)
    b = ease_out(ramp(u, 2.0, 2.7))
    d.text((W / 2, 1160), "TRAVEL WITH JD", font=inter("semibold", 30), fill=A(MUTED, b), anchor="ms")
    c = ease_out(ramp(u, 2.5, 3.2))
    d.text((W / 2, 1290 + (1 - c) * 20), "Apni wadiyan, apne log.", font=serif(58, italic=True), fill=A(SAF, c), anchor="ms")


PINS = [("Neelum", (930, 1150)), ("Poonch", (640, 1330)), ("Hunza", (840, 870)), ("Skardu", (990, 960)), ("Swat", (560, 1060))]
BOLTON, KOTLI = (190, 760), (760, 1260)


def arc_pt(p):
    c = (380, 360)
    x = (1 - p) ** 2 * BOLTON[0] + 2 * (1 - p) * p * c[0] + p ** 2 * KOTLI[0]
    y = (1 - p) ** 2 * BOLTON[1] + 2 * (1 - p) * p * c[1] + p ** 2 * KOTLI[1]
    return x, y


def pin(d, x, y, label, a, col=SAF, big=False):
    if a <= 0:
        return
    s = back_out(a)
    r = (18 if big else 13) * s
    d.ellipse([x - r * 2.2, y - r * 2.2, x + r * 2.2, y + r * 2.2], fill=A(col, 0.18 * a))
    d.ellipse([x - r, y - r, x + r, y + r], fill=A(col, a), outline=A(SNOW, a), width=3)
    d.text((x, y - r - 22), label, font=inter("bold" if big else "semibold", 40 if big else 34), fill=A(TEXT, a), anchor="ms")


def sc_map(L, u, dur):
    d = ImageDraw.Draw(L, "RGBA")
    caption(L, "Coming home from *Bolton*?", "Kotli, Khuiratta, Dadyal and Mirpur families", ease_out(ramp(u, 0.1, 0.7)))
    for gx in range(0, W, 120):
        d.line([(gx, 520), (gx, 1700)], fill=A(SNOW, 0.05), width=1)
    for gy in range(520, 1700, 120):
        d.line([(0, gy), (W, gy)], fill=A(SNOW, 0.05), width=1)
    pin(d, *BOLTON, "Bolton, UK", ease_out(ramp(u, 0.3, 0.9)), col=LAKE, big=True)
    fly = ease(ramp(u, 0.9, 3.4))
    n = int(80 * fly)
    for k in range(0, n, 2):
        a, b = arc_pt(k / 80), arc_pt((k + 1) / 80)
        d.line([a, b], fill=A(SNOW, 0.85), width=5)
    if 0 < fly < 1:
        x, y = arc_pt(fly)
        x2, y2 = arc_pt(min(1, fly + 0.01))
        ang = math.atan2(y2 - y, x2 - x)
        body = [(30, 0), (-22, -7), (-30, 0), (-22, 7)]
        wing = [(4, 0), (-10, -30), (-16, -30), (-8, 0), (-16, 30), (-10, 30)]
        tail = [(-20, 0), (-30, -14), (-34, -14), (-28, 0), (-34, 14), (-30, 14)]
        for shape in (wing, tail, body):
            pts = [(x + px * math.cos(ang) - py * math.sin(ang), y + px * math.sin(ang) + py * math.cos(ang)) for px, py in shape]
            d.polygon(pts, fill=A(SNOW, 1))
    pin(d, *KOTLI, "Kotli, AJK", ease_out(ramp(u, 3.3, 3.8)), big=True)
    for i, (name, (x, y)) in enumerate(PINS):
        a = ease_out(ramp(u, 3.8 + i * 0.25, 4.3 + i * 0.25))
        if a > 0:
            d.line([KOTLI, (KOTLI[0] + (x - KOTLI[0]) * a, KOTLI[1] + (y - KOTLI[1]) * a)], fill=A(SAF, 0.5 * a), width=3)
        pin(d, x, y, name, a)


def sc_home(L, u, dur):
    caption(L, "Plan the whole *family trip*", "Pickup, van, hotels, food and the best views", ease_out(ramp(u, 0.1, 0.7)))
    dest = meta("home")["#destinations"]
    if u < 2.6:
        phone(L, "home", 0, alpha=ease_out(ramp(u, 0, 0.5)), dy=(1 - ease_out(ramp(u, 0, 0.6))) * 80)
        tap(L, 320, 600, u - 1.9)
    else:
        y = scroll_at(u - 2.6, [(0, dest - 60), (4.0, dest + 2300)])
        phone(L, "home", y)


PLACES = [("hero.webp", "Chunda Valley", "Skardu"),
          ("ig/kachura.webp", "Upper Kachura Lake", "Skardu"),
          ("ig/sharda.webp", "Sharda", "Neelum Valley"),
          ("ig/leepa2.webp", "Leepa Valley", "Azad Jammu Kashmir"),
          ("ig/rainbowlake.webp", "Rainbow Lake", "Minimarg"),
          ("ig/banjosa-photo.webp", "Banjosa Lake", "Poonch"),
          ("ig/kalam.webp", "Kalam", "Swat")]
SLOT = 60 / 96 * 2  # two beats per photo


def hblur(im, k):
    """Horizontal motion blur by squashing and stretching."""
    if k < 2:
        return im
    w, h = im.size
    return im.resize((max(8, w // k), h), Image.BILINEAR).resize((w, h), Image.BILINEAR)


def place_frame(i, p):
    """Photo i at progress p (0..1 within its slot): punch-in zoom then slow drift."""
    rel = PLACES[i][0]
    base = photo(rel, W, H)
    z = 1.16 - 0.10 * ease_out(clamp(p / 0.25)) - 0.04 * p
    zw, zh = int(W * z), int(H * z)
    im = base.resize((zw, zh), Image.BILINEAR)
    ox = (zw - W) // 2 + int((i % 2 * 2 - 1) * 20 * p)
    return im.crop((ox, (zh - H) // 2, ox + W, (zh - H) // 2 + H))


def sc_places(L, u, dur):
    i = min(len(PLACES) - 1, int(u / SLOT))
    p = (u - i * SLOT) / SLOT
    frame = place_frame(i, p)
    whip = 0.16 / SLOT
    if p > 1 - whip and i < len(PLACES) - 1:
        q = (p - (1 - whip)) / whip
        nxt = place_frame(i + 1, 0)
        sh = int(ease(q) * W)
        out = Image.new("RGB", (W, H))
        out.paste(hblur(frame, 4 + int(q * 30)), (-sh, 0))
        out.paste(hblur(nxt, 4 + int((1 - q) * 30)), (W - sh, 0))
        frame = out
    L.paste(frame, (0, 0))
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for y in range(H - 760, H, 8):
        gd.rectangle([0, y, W, y + 8], fill=(0, 0, 0, int(200 * ((y - (H - 760)) / 760) ** 1.5)))
    for y in range(0, 420, 8):
        gd.rectangle([0, y, W, y + 8], fill=(0, 0, 0, int(140 * (1 - y / 420) ** 1.5)))
    L.paste(grad, (0, 0), grad)
    flash = clamp(1 - (u - i * SLOT) / 0.14) if i > 0 else 0
    if flash > 0:
        fl = Image.new("RGBA", (W, H), (255, 255, 255, int(110 * flash)))
        L.paste(fl, (0, 0), fl)
    d = ImageDraw.Draw(L, "RGBA")
    name, area = PLACES[i][1], PLACES[i][2]
    t_in = ease_out(clamp((u - i * SLOT) / 0.3))
    x = 90 - (1 - t_in) * 120
    y = H - 330
    d.ellipse([x, y - 54, x + 44, y - 10], fill=A(SAF, t_in))
    d.polygon([(x + 6, y - 26), (x + 38, y - 26), (x + 22, y + 6)], fill=A(SAF, t_in))
    d.ellipse([x + 14, y - 40, x + 30, y - 24], fill=A(DARK, t_in))
    d.text((x + 64, y - 6), area.upper(), font=inter("bold", 34), fill=A(SAF, t_in), anchor="ls")
    size = 100
    while serif(size).getlength(name) > W - 200 and size > 60:
        size -= 4
    fnt = serif(size)
    d.text((x - 4, y + 104), name, font=fnt, fill=A(TEXT, t_in), anchor="ls")
    wbar = d.textlength(name, font=fnt) * ease_out(clamp((u - i * SLOT - 0.1) / 0.35))
    d.rectangle([x, y + 130, x + wbar, y + 138], fill=A(SAF, t_in))
    d.text((W / 2, 150), "Real places, real photos by JD", font=inter("semibold", 34), fill=A(TEXT, ease_out(ramp(u, 0, 0.6)) * 0.9), anchor="ms")
    for k in range(len(PLACES)):
        cx = W / 2 + (k - (len(PLACES) - 1) / 2) * 34
        d.rounded_rectangle([cx - 12, 186, cx + 12, 194], 4, fill=A(SNOW, 0.95 if k == i else 0.35))


def sc_trip(L, u, dur):
    caption(L, "Every trip, *day by day*", "Route, stays, meals and what to bring", ease_out(ramp(u, 0.1, 0.7)))
    plan = meta("trip")["#plan"]
    y = scroll_at(u, [(0, 0), (1.4, 0), (2.6, 330), (3.6, plan - 30), (6.6, plan + 2000)])
    phone(L, "trip", y, alpha=ease_out(ramp(u, 0, 0.4)))


def car(d, x, y, s=1.0, col=SAF, t=0.0):
    pts = [(6, 30), (14, 18), (26, 12), (62, 11), (80, 17), (92, 24), (108, 26), (116, 33), (116, 36), (6, 36)]
    d.polygon([(x + px * s, y + py * s) for px, py in pts], fill=A(col, 1))
    d.polygon([(x + px * s, y + py * s) for px, py in [(24, 17), (34, 14), (58, 14), (66, 20), (24, 21)]], fill=A(DARK, 0.9))
    for wx in (30, 94):
        cx, cy, r = x + wx * s, y + 36 * s, 7 * s
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=A((23, 33, 29), 1))
        ang = t * 18
        d.line([(cx - math.cos(ang) * r * 0.7, cy - math.sin(ang) * r * 0.7), (cx + math.cos(ang) * r * 0.7, cy + math.sin(ang) * r * 0.7)], fill=A((210, 205, 195), 1), width=max(2, int(2 * s)))
    d.rectangle([x + 108 * s, y + 28 * s, x + 115 * s, y + 31 * s], fill=A((255, 246, 220), 1))
    for k, ln in enumerate((40, 26)):
        d.line([(x - 10 * s - ln * s, y + (24 + k * 6) * s), (x - 10 * s, y + (24 + k * 6) * s)], fill=A(SNOW, 0.35), width=3)


def sc_vehicles(L, u, dur):
    caption(L, "The right *ride* for every trip", "Vans, cars and luxury 4x4s", ease_out(ramp(u, 0.1, 0.7)))
    v = meta("home")["#vehicles"]
    y = scroll_at(u, [(0, v - 20), (0.8, v - 20), (5.6, v + 2250)])
    phone(L, "home", y, alpha=ease_out(ramp(u, 0, 0.4)))
    d = ImageDraw.Draw(L, "RGBA")
    d.line([(0, 488), (W, 488)], fill=A(SNOW, 0.18), width=2)
    x = -200 + (W + 400) * ((u / 3.0) % 1)
    car(d, x, 446, 1.15, t=u)


def bubble(L, x, y, w, text_lines, mine, a, tick=False):
    if a <= 0:
        return 0
    d = ImageDraw.Draw(L, "RGBA")
    f = inter("medium", 34)
    h = 40 + len(text_lines) * 46
    s = back_out(a)
    bw, bh = w * s, h * s
    x0 = x if not mine else x - bw
    col = (220, 248, 198) if mine else (255, 255, 255)
    d.rounded_rectangle([x0, y, x0 + bw, y + bh], 26, fill=A(col, a))
    if s > 0.9:
        for i, ln in enumerate(text_lines):
            d.text((x0 + 28, y + 56 + i * 46), ln, font=f, fill=A((25, 35, 30), a), anchor="ls")
        if tick:
            d.text((x0 + bw - 24, y + bh - 14), "\u2713\u2713", font=inter("bold", 24), fill=A((52, 160, 230), a), anchor="rs")
    return h


def sc_chat(L, u, dur):
    caption(L, "Plan it all on *WhatsApp*", "One message. JD handles the rest.", ease_out(ramp(u, 0.1, 0.7)))
    d = ImageDraw.Draw(L, "RGBA")
    a = ease_out(ramp(u, 0, 0.5))
    x0, y0, x1, y1 = 90, 520, 990, 1500
    d.rounded_rectangle([x0, y0, x1, y1], 40, fill=A((236, 229, 216), a))
    d.rounded_rectangle([x0, y0, x1, y0 + 130], 40, fill=A(PINE, a))
    d.rectangle([x0, y0 + 90, x1, y0 + 130], fill=A(PINE, a))
    draw_mark(L, x0 + 80, y0 + 65, 76, alpha=a)
    d.text((x0 + 140, y0 + 60), "JD Travels", font=inter("bold", 36), fill=A(TEXT, a), anchor="ls")
    d.text((x0 + 140, y0 + 100), "online", font=inter("medium", 26), fill=A(MUTED, a), anchor="ls")
    y = y0 + 170
    y += bubble(L, x1 - 30, y, 720, ["Assalam o Alaikum JD!", "6 of us, July, Neelum please"], True, ramp(u, 0.6, 1.0), tick=True) + 26
    if 1.3 < u < 2.2:
        for k in range(3):
            bob = math.sin(u * 12 + k) * 6
            d.ellipse([x0 + 60 + k * 30, y + 30 + bob, x0 + 76 + k * 30, y + 46 + bob], fill=A((120, 130, 125), 1))
    y += bubble(L, x0 + 30, y, 760, ["Walaikum Salam! Your plan:", "4 days, riverside stays,", "pickup from your home"], False, ramp(u, 2.2, 2.6)) + 26
    bubble(L, x1 - 30, y, 380, ["Perfect, book it!"], True, ramp(u, 3.2, 3.6), tick=True)
    steps = ["Message", "Get your plan", "Confirm", "Enjoy"]
    for i, s in enumerate(steps):
        b = ease_out(ramp(u, 4.0 + i * 0.3, 4.4 + i * 0.3))
        if b <= 0:
            continue
        cx, cy = 175 + i * 243, 1640
        d.ellipse([cx - 44, cy - 44 + (1 - b) * 20, cx + 44, cy + 44 + (1 - b) * 20], fill=A(SAF, b))
        d.text((cx, cy + 14 + (1 - b) * 20), f"0{i + 1}", font=serif(40), fill=A(DARK, b), anchor="ms")
        d.text((cx, cy + 96), s, font=inter("semibold", 28), fill=A(TEXT, b), anchor="ms")
        if i < 3:
            d.line([(cx + 56, cy), (cx + 187, cy)], fill=A(SAF, 0.5 * b), width=3)


def icon(d, kind, cx, cy, a):
    c = A(SAF, a)
    if kind == "home":
        d.polygon([(cx - 34, cy), (cx, cy - 32), (cx + 34, cy)], fill=c)
        d.rectangle([cx - 24, cy, cx + 24, cy + 30], fill=c)
        d.rectangle([cx - 7, cy + 10, cx + 7, cy + 30], fill=A(DARK, a))
    elif kind == "van":
        d.rounded_rectangle([cx - 40, cy - 22, cx + 36, cy + 16], 8, fill=c)
        d.rectangle([cx - 30, cy - 14, cx + 20, cy - 2], fill=A(DARK, a))
        for wx in (-24, 22):
            d.ellipse([cx + wx - 10, cy + 8, cx + wx + 10, cy + 28], fill=A(SNOW, a))
    elif kind == "family":
        for dx, r, dy in ((-24, 13, 4), (0, 16, -4), (24, 11, 8)):
            d.ellipse([cx + dx - r, cy + dy - 30 - r, cx + dx + r, cy + dy - 30 + r], fill=c)
            d.rounded_rectangle([cx + dx - r, cy + dy - 12, cx + dx + r, cy + dy + 28], r, fill=c)
    elif kind == "food":
        d.ellipse([cx - 32, cy - 32, cx + 32, cy + 32], outline=c, width=7)
        d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=c)
    elif kind == "chat":
        d.rounded_rectangle([cx - 36, cy - 28, cx + 36, cy + 18], 16, fill=c)
        d.polygon([(cx - 18, cy + 16), (cx - 26, cy + 34), (cx, cy + 16)], fill=c)
        for k in (-16, 0, 16):
            d.ellipse([cx + k - 5, cy - 10, cx + k + 5, cy], fill=A(DARK, a))
    elif kind == "pin":
        d.ellipse([cx - 26, cy - 40, cx + 26, cy + 12], fill=c)
        d.polygon([(cx - 22, cy), (cx + 22, cy), (cx, cy + 36)], fill=c)
        d.ellipse([cx - 10, cy - 24, cx + 10, cy - 4], fill=A(DARK, a))


def sc_families(L, u, dur):
    caption(L, "Made for *families*", "Home for the holidays, from anywhere", ease_out(ramp(u, 0.1, 0.7)))
    d = ImageDraw.Draw(L, "RGBA")
    tiles = [("home", "Pickup from home"), ("van", "Family vans"), ("family", "Elders and kids"),
             ("food", "Halal food"), ("pin", "AJK, GB and Swat"), ("chat", "JD on WhatsApp")]
    for i, (k, label) in enumerate(tiles):
        a = ease_out(ramp(u, 0.4 + i * 0.22, 0.9 + i * 0.22))
        if a <= 0:
            continue
        col, row = i % 2, i // 2
        x0, y0 = 110 + col * 440, 560 + row * 330 + (1 - a) * 40
        d.rounded_rectangle([x0, y0, x0 + 420, y0 + 300], 34, fill=A(SNOW, 0.07 * a), outline=A(SNOW, 0.18 * a), width=2)
        icon(d, k, x0 + 210, y0 + 115, a)
        d.text((x0 + 210, y0 + 240), label, font=inter("semibold", 36), fill=A(TEXT, a), anchor="ms")


def sc_outro(L, u, dur):
    bg = photo("hero.webp", W, H)
    z = 1.08 - 0.08 * ease_out(ramp(u, 0, dur))
    zw, zh = int(W * z), int(H * z)
    bgz = bg.resize((zw, zh), Image.BILINEAR).crop(((zw - W) // 2, (zh - H) // 2, (zw - W) // 2 + W, (zh - H) // 2 + H))
    a = ease_out(ramp(u, 0, 0.6))
    shade = Image.new("RGBA", (W, H), (6, 26, 20, 175))
    lay = bgz.convert("RGBA")
    lay.alpha_composite(shade)
    lay.putalpha(round(255 * a))
    L.paste(lay, (0, 0), lay)
    d = ImageDraw.Draw(L, "RGBA")
    draw_mark(L, W / 2, 470, 200, draw_p=ease(ramp(u, 0.2, 1.0)), alpha=a)
    b = ease_out(ramp(u, 0.8, 1.4))
    wordmark(L, W / 2, 690, 100, b)
    d.text((W / 2, 760), "Family trips from home", font=inter("semibold", 36), fill=A(MUTED, b), anchor="ms")
    pills = ["Azad Jammu Kashmir", "Gilgit-Baltistan", "Swat", "Cities"]
    f = inter("semibold", 32)
    rows = [pills[:2], pills[2:]]
    for r, row in enumerate(rows):
        widths = [d.textlength(p, font=f) + 56 for p in row]
        x = W / 2 - (sum(widths) + 20 * (len(row) - 1)) / 2
        for p, wdt in zip(row, widths):
            c = ease_out(ramp(u, 1.3 + r * 0.25, 1.8 + r * 0.25))
            y = 840 + r * 92
            d.rounded_rectangle([x, y, x + wdt, y + 70], 35, fill=A(SNOW, 0.12 * c), outline=A(SAF, 0.8 * c), width=2)
            d.text((x + wdt / 2, y + 47), p, font=f, fill=A(TEXT, c), anchor="ms")
            x += wdt + 20
    e = ease_out(ramp(u, 2.0, 2.6))
    d.rounded_rectangle([W / 2 - 330, 1080, W / 2 + 330, 1180], 50, fill=A(SAF, e))
    d.text((W / 2, 1144), "Plan your family trip", font=inter("bold", 40), fill=A(DARK, e), anchor="ms")
    d.text((W / 2, 1250), "Website launching soon", font=serif(44, italic=True), fill=A(SNOW, e), anchor="ms")
    datix_credit(L, 1420, ease_out(ramp(u, 3.0, 3.8)))


# ---------------------------------------------------------------- timeline
SCENES = [
    ("intro", 4.0, sc_intro),
    ("map", 6.5, sc_map),
    ("home", 7.0, sc_home),
    ("places", round(SLOT * 7, 3), sc_places),
    ("trip", 7.0, sc_trip),
    ("vehicles", 6.2, sc_vehicles),
    ("chat", 6.0, sc_chat),
    ("families", 4.6, sc_families),
    ("outro", 6.4, sc_outro),
]
TL, t = [], 0.0
for key, dur, fn in SCENES:
    TL.append((key, t, dur, fn))
    t += dur
DUR = t
XF = 0.4


def render_scene(i, tt):
    key, start, dur, fn = TL[i]
    L = background(tt)
    fn(L, tt - start, dur)
    return L


def render(tt):
    for i, (key, start, dur, fn) in enumerate(TL):
        if start <= tt < start + dur or (i == len(TL) - 1 and tt >= start):
            break
    cur = render_scene(i, tt)
    if i > 0 and tt - TL[i][1] < XF:
        prev = render_scene(i - 1, tt)
        cur = Image.blend(prev, cur, ease((tt - TL[i][1]) / XF))
    return cur


# ---------------------------------------------------------------- sound
SR = 48000


def synth(path):
    n = int(DUR * SR)
    tt = np.arange(n) / SR
    out = np.zeros((n, 2), np.float32)
    rng = np.random.default_rng(11)

    def add(sig, start, gain=1.0, pan=0.0):
        i = int(start * SR)
        if i >= n:
            return
        sig = np.asarray(sig, np.float32)[: n - i] * gain
        out[i:i + len(sig), 0] += sig * (1 - max(0, pan))
        out[i:i + len(sig), 1] += sig * (1 + min(0, pan))

    def env_t(d):
        return np.arange(int(d * SR)) / SR

    def dhum():
        e = env_t(0.5)
        return np.sin(2 * math.pi * (62 + 50 * np.exp(-e * 18)) * e) * np.exp(-e * 7)

    def tak():
        e = env_t(0.15)
        nz = rng.normal(0, 1, len(e))
        nz = nz - np.convolve(nz, np.ones(4) / 4, mode="same")
        return (nz * 0.5 + np.sin(2 * math.pi * 420 * e) * 0.7) * np.exp(-e * 40)

    def pluck(f, d=1.6):
        """Karplus-Strong string, a soft rabab style note."""
        N = int(SR / f)
        buf = rng.uniform(-1, 1, N)
        L = int(d * SR)
        o = np.zeros(L)
        for k in range(L):
            o[k] = buf[k % N]
            buf[k % N] = 0.5 * (buf[k % N] + buf[(k + 1) % N]) * 0.996
        return o * np.exp(-np.arange(L) / SR * 1.5)

    def whoosh(d, up=True):
        e = env_t(d)
        nz = rng.normal(0, 1, len(e))
        k = 30
        nz = np.convolve(nz, np.ones(k) / k, mode="same")
        shape = np.sin(math.pi * e / d) ** 2
        return nz * shape * 3

    def shutter():
        e = env_t(0.12)
        nz = rng.normal(0, 1, len(e))
        return nz * (np.exp(-e * 90) + 0.6 * np.exp(-np.abs(e - 0.05) * 300)) * 0.6

    def pop(f=880):
        e = env_t(0.18)
        return np.sin(2 * math.pi * (f + 400 * np.exp(-e * 30)) * e) * np.exp(-e * 22)

    def chime(f):
        e = env_t(1.6)
        return (np.sin(2 * math.pi * f * e) + 0.4 * np.sin(2 * math.pi * f * 2.0 * e) + 0.2 * np.sin(2 * math.pi * f * 3.01 * e)) * np.exp(-e * 2.5)

    def boom():
        e = env_t(1.8)
        return np.sin(2 * math.pi * (40 + 70 * np.exp(-e * 10)) * e) * np.exp(-e * 2.4)

    # ambient pad (D minor, slow swell)
    env = np.clip(tt / 3, 0, 1) * np.clip((DUR - tt) / 3, 0, 1)
    pad = np.zeros(n)
    for f, g in ((73.4, 0.5), (110.0, 0.35), (146.8, 0.3), (174.6, 0.18), (220.0, 0.15)):
        for det in (-0.4, 0.4):
            pad += g * np.sin(2 * math.pi * (f + det) * tt + rng.uniform(0, 6))
    pad *= env * (0.8 + 0.2 * np.sin(2 * math.pi * tt / 7))
    out += (pad * 0.09)[:, None]

    # dhol groove, 96 bpm, from the end of the intro until the outro hit
    beat = 60 / 96
    start, stop = TL[1][1] - 0.3, TL[-1][1]
    k = 0
    tb = start
    while tb < stop:
        pos = k % 8
        if pos in (0, 3, 6):
            add(dhum(), tb, 0.55)
        if pos in (2, 5, 7):
            add(tak(), tb, 0.22, pan=0.2)
        if pos in (1, 4):
            add(tak(), tb + beat / 4, 0.12, pan=-0.2)
        k += 1
        tb += beat / 2

    # plucked melody in D minor pentatonic over the scenes
    notes = [293.7, 349.2, 392.0, 440.0, 523.3, 440.0, 392.0, 349.2]
    for i, tb in enumerate(np.arange(TL[1][1], TL[-1][1], beat * 2)):
        if i % 4 != 3:
            add(pluck(notes[i % len(notes)]), tb, 0.16, pan=(-0.3 if i % 2 else 0.3))

    # scene sounds
    add(chime(587.3), 0.3, 0.25)
    add(chime(880.0), 1.8, 0.18)
    m0 = TL[1][1]
    add(whoosh(2.6), m0 + 0.9, 0.18)
    for i in range(6):
        add(pop(700 + i * 90), m0 + 3.3 + i * 0.25, 0.10)
    h0 = TL[2][1]
    add(pop(1200), h0 + 1.9, 0.12)
    p0 = TL[3][1]
    for i in range(7):
        if i:
            add(whoosh(0.3), p0 + i * SLOT - 0.2, 0.35, pan=0.3)
        add(dhum(), p0 + i * SLOT, 0.5)
        add(shutter(), p0 + i * SLOT + 0.02, 0.35)
    c0 = TL[6][1]
    add(pop(1000), c0 + 0.6, 0.18)
    add(pop(760), c0 + 2.2, 0.18)
    add(pop(1000), c0 + 3.2, 0.18)
    for i in range(4):
        add(pop(600 + i * 120), c0 + 4.0 + i * 0.3, 0.08)
    o0 = TL[-1][1]
    add(whoosh(1.2), o0 - 1.2, 0.25)
    add(boom(), o0, 0.6)
    for i, f in enumerate((587.3, 740.0, 880.0, 1174.7)):
        add(chime(f), o0 + 0.9 + i * 0.18, 0.12)
    add(chime(587.3), o0 + 3.0, 0.15)

    out *= 0.85 / max(1e-6, np.abs(out).max())
    out = np.tanh(out * 1.3) / np.tanh(1.3)
    fade = np.minimum(np.clip(tt / 0.3, 0, 1), np.clip((DUR - tt) / 0.8, 0, 1))[:, None]
    pcm = (out * fade * 32767 * 0.9).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
    os.makedirs(os.path.join(HERE, "work"), exist_ok=True)
    assert DUR <= 60, DUR
    if "--preview" in sys.argv:
        pdir = os.path.join(HERE, "work", "preview")
        os.makedirs(pdir, exist_ok=True)
        ts = [float(x) for x in sys.argv[sys.argv.index("--preview") + 1:]]
        for x in ts:
            render(x).save(os.path.join(pdir, f"t{x:05.1f}.jpg"), quality=85)
        print("duration", DUR, "preview ->", pdir)
        return
    wav = os.path.join(HERE, "work", "reel.wav")
    synth(wav)
    mp4 = os.path.join(HERE, "out", "jd-travels-reel.mp4")
    cmd = [FFMPEG, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
           "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", mp4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    total = int(DUR * FPS)
    for i in range(total):
        proc.stdin.write(render(i / FPS).tobytes())
        if i % 150 == 0:
            print(f"frame {i}/{total}", flush=True)
    proc.stdin.close()
    proc.wait()
    print("wrote", mp4, "duration", DUR)


if __name__ == "__main__":
    main()
