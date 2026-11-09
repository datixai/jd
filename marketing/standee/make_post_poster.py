"""Instagram post (1080 x 1350) and A4 wall poster for @jds_wonders, in the same style as the standee.
Run: python make_post_poster.py
Outputs in out/: JDTravels_instagram_post.jpg/.png, JDTravels_poster_A4.pdf/.png/_preview.jpg
"""
import os

import cv2
import numpy as np
import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

import make_standee as st

OUT = st.OUT
MEDIA = st.MEDIA
URL = st.URL
PINE, DARK, SAFFRON, SNOW, LAKE, WHITE, MUTED = st.PINE, st.DARK, st.SAFFRON, st.SNOW, st.LAKE, st.WHITE, st.MUTED


class Canvas:
    """Layout in units of a 1000 px wide reference, rendered at any pixel width."""

    def __init__(self, w, h):
        self.W, self.H = w, h
        self.k = w / 1000

    def u(self, v):
        return int(round(v * self.k))

    def font(self, name, size):
        return ImageFont.truetype(os.path.join(st.FG, name), self.u(size))


def text(img, cv, cx, y, txt, f, fill, track=0, shadow=None, anchor='c'):
    d = ImageDraw.Draw(img)
    tw = d.textlength(txt, font=f) + cv.u(track) * max(0, len(txt) - 1)
    x = cx - tw / 2 if anchor == 'c' else cx
    if shadow:
        sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        xx = x
        for ch in txt:
            sd.text((xx + cv.u(2), y + cv.u(3)), ch, font=f, fill=(0, 0, 0, shadow))
            xx += sd.textlength(ch, font=f) + cv.u(track)
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(cv.u(7))))
    xx = x
    for ch in txt:
        d.text((xx, y), ch, font=f, fill=fill)
        xx += d.textlength(ch, font=f) + cv.u(track)
    return tw


def backdrop(cv, hero_frac):
    W, H = cv.W, cv.H
    g = np.linspace(0, 1, H)[:, None]
    mid = np.clip(1 - np.abs(g - 0.62) / 0.5, 0, 1)
    bg = np.array(DARK)[None, :] * (1 - mid) + np.array(PINE)[None, :] * mid
    img = Image.fromarray(np.repeat(bg[:, None, :], W, axis=1).astype(np.uint8)).convert('RGBA')
    hero_h = int(H * hero_frac)
    hero = st.cover(os.path.join(MEDIA, 'hero.webp'), W, hero_h, 0.35)
    hero = hero.filter(ImageFilter.GaussianBlur(cv.u(1.0)))
    yy = np.linspace(0, 1, hero_h)[:, None]
    a = np.clip((1 - yy) / 0.42, 0, 1) ** 1.3 * np.ones((hero_h, W))
    top_dark = np.clip(1 - yy / 0.45, 0, 1) * 0.55
    hn = np.array(hero).astype(np.float32)
    hn = hn * (1 - top_dark[..., None]) + np.array(DARK)[None, None, :] * top_dark[..., None]
    layer = Image.fromarray(hn.astype(np.uint8)).convert('RGBA')
    layer.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    img.alpha_composite(layer)
    return img


def logo_row(img, cv, y, scale=1.0):
    d = ImageDraw.Draw(img)
    tile = cv.u(92 * scale)
    f_word = cv.font('georgiab.ttf', 64 * scale)
    f_tag = cv.font('segoeuib.ttf', 18 * scale)
    word_w = d.textlength('JD Travels', font=f_word)
    x0 = (cv.W - (tile + cv.u(22 * scale) + word_w)) // 2
    img.alpha_composite(st.logo_tile(tile), (int(x0), y))
    tx = x0 + tile + cv.u(22 * scale)
    text(img, cv, tx, y + cv.u(2 * scale), 'JD ', f_word, WHITE, anchor='l', shadow=90)
    text(img, cv, tx + d.textlength('JD ', font=f_word), y + cv.u(2 * scale), 'Travels', f_word, SAFFRON, anchor='l', shadow=90)
    text(img, cv, tx + cv.u(2), y + cv.u(72 * scale), 'TRAVEL WITH JD', f_tag, MUTED, track=5 * scale, anchor='l')
    return y + tile


def headline(img, cv, y, s=1.0):
    f1 = cv.font('georgiab.ttf', 86 * s)
    f2 = cv.font('georgiab.ttf', 150 * s)
    text(img, cv, cv.W // 2, y, 'Follow for', f1, WHITE, shadow=150)
    y += cv.u(94 * s)
    text(img, cv, cv.W // 2, y, 'Kashmir', f2, SAFFRON, shadow=170)
    y += cv.u(152 * s)
    text(img, cv, cv.W // 2, y, 'travel', f1, WHITE, shadow=150)
    return y + cv.u(110 * s)


def photo_strip(img, cv, y, tw, labels=True):
    tiles = [('kachura.webp', 'Kachura Lake'), ('shangrila.webp', 'Shangrila'), ('rainbowlake.webp', 'Rainbow Lake')]
    tw_ = cv.u(tw)
    gap = cv.u(24)
    sx = (cv.W - (3 * tw_ + 2 * gap)) // 2
    for i, (f, _) in enumerate(tiles):
        pad = cv.u(7)
        ph = st.cover(os.path.join(MEDIA, 'ig', f), tw_ - 2 * pad, tw_ - 2 * pad, 0.5)
        x = sx + i * (tw_ + gap)
        ty = y + (cv.u(14) if i == 1 else 0)
        st.soft_shadow(img, (x, ty, x + tw_, ty + tw_), cv.u(22), cv.u(12), 150, cv.u(8))
        frame = Image.new('RGBA', (tw_, tw_), (0, 0, 0, 0))
        ImageDraw.Draw(frame).rounded_rectangle([0, 0, tw_ - 1, tw_ - 1], cv.u(22), fill=SNOW)
        img.alpha_composite(frame, (x, ty))
        img.alpha_composite(st.rounded(ph, cv.u(16)), (x + pad, ty + pad))
    y += tw_ + cv.u(14)
    if labels:
        f_lab = cv.font('segoeuib.ttf', 19)
        for i, (_, lab) in enumerate(tiles):
            text(img, cv, sx + i * (tw_ + gap) + tw_ // 2, y + cv.u(12) + (cv.u(14) if i == 1 else 0), lab, f_lab, MUTED, track=2)
        y += cv.u(48)
    return y


def ridge(img, cv, y, width):
    d = ImageDraw.Draw(img)
    pts = [(0.0, 1.0), (0.16, 0.55), (0.24, 0.75), (0.38, 0.15), (0.46, 0.45), (0.55, 0.0),
           (0.66, 0.6), (0.74, 0.4), (0.86, 0.85), (1.0, 0.5)]
    h = cv.u(36)
    d.line([(px * cv.W, y + py * h) for px, py in pts], fill=SAFFRON + (255,), width=width, joint='curve')


def credit(img, cv, y):
    """Very small 'Designed by Datix AI' line."""
    text(img, cv, cv.W // 2, y, 'Designed by Datix AI', cv.font('segoeui.ttf', 13), (150, 175, 162), track=1)


# ---------------------------------------------------------------- Instagram post
def instagram_post():
    cv = Canvas(2160, 2700)          # rendered at 2x, saved at 1080 x 1350
    img = backdrop(cv, 0.62)
    y = logo_row(img, cv, cv.u(70), 0.9)
    y = headline(img, cv, y + cv.u(70), 0.95)
    f_sub = cv.font('segoeuib.ttf', 31)
    for line in ('Nature and travel photography from', 'Azad Jammu Kashmir, Gilgit-Baltistan and Swat'):
        text(img, cv, cv.W // 2, y, line, f_sub, SNOW, shadow=200)
        y += cv.u(44)
    y = photo_strip(img, cv, y + cv.u(36), 262)

    # follow button with handle
    d = ImageDraw.Draw(img)
    f_h = cv.font('georgiab.ttf', 58)
    glyph = cv.u(62)
    hw = d.textlength('@jds_wonders', font=f_h)
    bw = glyph + cv.u(24) + hw + cv.u(110)
    bh = cv.u(110)
    bx0, by0 = (cv.W - bw) / 2, y + cv.u(26)
    st.soft_shadow(img, (bx0, by0, bx0 + bw, by0 + bh), cv.u(55), cv.u(16), 170, cv.u(10))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([bx0, by0, bx0 + bw, by0 + bh], cv.u(55), fill=WHITE)
    gx = int(bx0 + cv.u(55))
    img.alpha_composite(st.ig_glyph(glyph, LAKE), (gx, int(by0 + (bh - glyph) / 2)))
    text(img, cv, gx + glyph + cv.u(24), by0 + cv.u(18), '@jds_wonders', f_h, PINE, anchor='l')
    by1 = by0 + bh + cv.u(32)
    f_cta = cv.font('segoeuib.ttf', 30)
    text(img, cv, cv.W // 2, by1, 'Tap follow for more Kashmir travel', f_cta, SAFFRON, track=1)

    credit(img, cv, cv.H - cv.u(26))
    rgb = img.convert('RGB').resize((1080, 1350), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    rgb.save(os.path.join(OUT, 'JDTravels_instagram_post.jpg'), quality=95, subsampling=0)
    rgb.save(os.path.join(OUT, 'JDTravels_instagram_post.png'))
    print('instagram post 1080x1350, content ends at', round((by1 + cv.u(40)) / cv.H, 3))


# ---------------------------------------------------------------- A4 wall poster
MM = 300 / 25.4                      # px per mm at 300 dpi


def poster_a4():
    bleed = 3
    w_mm, h_mm = 210 + 2 * bleed, 297 + 2 * bleed
    cv = Canvas(round(w_mm * MM), round(h_mm * MM))   # 2551 x 3579 px at 300 dpi
    img = backdrop(cv, 0.55)
    safe = cv.u(10 * 1000 / w_mm * bleed / 3)
    y = logo_row(img, cv, cv.u(52), 0.8)
    y = headline(img, cv, y + cv.u(34), 0.64)
    f_sub = cv.font('segoeuib.ttf', 24)
    for line in ('Nature and travel photography from', 'Azad Jammu Kashmir, Gilgit-Baltistan and Swat'):
        text(img, cv, cv.W // 2, y, line, f_sub, SNOW, shadow=200)
        y += cv.u(33)
    y = photo_strip(img, cv, y + cv.u(16), 176, labels=False)

    # QR card
    qr = segno.make(URL, error='h', micro=False)
    n = qr.symbol_size(border=0)[0]
    mod = cv.u(290) // n
    qsize = mod * n
    quiet = mod * 4
    _d = ImageDraw.Draw(img)
    handle_w = cv.u(56) + cv.u(16) + _d.textlength('@jds_wonders', font=cv.font('georgiab.ttf', 54))
    card_w = int(max(qsize + 2 * quiet + cv.u(70), handle_w + cv.u(80)))
    head_h, foot_h = cv.u(70), cv.u(122)
    card_h = head_h + qsize + 2 * quiet + foot_h
    cx0, cy0 = (cv.W - card_w) // 2, y + cv.u(22)
    st.soft_shadow(img, (cx0, cy0, cx0 + card_w, cy0 + card_h), cv.u(30), cv.u(20), 190, cv.u(12))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([cx0, cy0, cx0 + card_w, cy0 + card_h], cv.u(30), fill=WHITE)
    d.rounded_rectangle([cx0, cy0, cx0 + card_w, cy0 + head_h + cv.u(30)], cv.u(30), fill=SAFFRON)
    d.rectangle([cx0, cy0 + head_h, cx0 + card_w, cy0 + head_h + cv.u(31)], fill=WHITE)
    d.rounded_rectangle([cx0 + cv.u(8), cy0 + cv.u(8), cx0 + card_w - cv.u(8), cy0 + card_h - cv.u(8)], cv.u(23),
                        outline=SAFFRON, width=cv.u(2))
    text(img, cv, cv.W // 2, cy0 + cv.u(10), 'Scan and follow', cv.font('georgiab.ttf', 48), DARK)
    qx, qy = (cv.W - qsize) // 2, cy0 + head_h + quiet
    matrix = np.array([[1 if v else 0 for v in row] for row in qr.matrix], np.uint8)
    for r in range(n):
        for c in range(n):
            if matrix[r, c]:
                d.rectangle([qx + c * mod, qy + r * mod, qx + (c + 1) * mod - 1, qy + (r + 1) * mod - 1], fill=DARK)
    fy = qy + qsize + quiet - cv.u(6)
    f_h = cv.font('georgiab.ttf', 54)
    glyph = cv.u(56)
    hw = d.textlength('@jds_wonders', font=f_h)
    gx = int(cv.W / 2 - (glyph + cv.u(16) + hw) / 2)
    img.alpha_composite(st.ig_glyph(glyph, LAKE), (gx, fy + cv.u(10)))
    text(img, cv, gx + glyph + cv.u(16), fy, '@jds_wonders', f_h, PINE, anchor='l')
    text(img, cv, cv.W // 2, fy + cv.u(84), 'ON INSTAGRAM', cv.font('segoeuib.ttf', 21), LAKE, track=6)

    y = cy0 + card_h + cv.u(22)
    ridge(img, cv, y, cv.u(2.5))
    text(img, cv, cv.W // 2, y + cv.u(48), 'Trips across Kashmir with families from Kotli, Mirpur and abroad',
         cv.font('segoeuib.ttf', 23), MUTED)
    bottom = y + cv.u(80)
    credit(img, cv, cv.H - cv.u(10 * 1000 / w_mm) - cv.u(20))

    rgb = img.convert('RGB')
    png = os.path.join(OUT, 'JDTravels_poster_A4.png')
    rgb.save(png, dpi=(300, 300))
    prev = os.path.join(OUT, 'JDTravels_poster_A4_preview.jpg')
    rgb.resize((cv.W // 4, cv.H // 4), Image.LANCZOS).save(prev, quality=88)

    # PDF at A4 plus 3 mm bleed, photo layer as JPEG, QR as vectors
    pt = 72 / 25.4
    pw, ph = w_mm * pt, h_mm * pt
    jpg = os.path.join(OUT, '_poster_bg.jpg')
    rgb.save(jpg, quality=95, subsampling=0)
    pdf = os.path.join(OUT, 'JDTravels_poster_A4.pdf')
    c = canvas.Canvas(pdf, pagesize=(pw, ph))
    c.setTitle('JD Travels poster A4, @jds_wonders')
    c.drawImage(ImageReader(jpg), 0, 0, pw, ph)
    s = pw / cv.W
    c.setFillColorRGB(1, 1, 1)
    c.rect((qx - mod) * s, ph - (qy + qsize + mod) * s, (qsize + 2 * mod) * s, (qsize + 2 * mod) * s, stroke=0, fill=1)
    c.setFillColorRGB(*[v / 255 for v in DARK])
    for r in range(n):
        for col in range(n):
            if matrix[r, col]:
                c.rect((qx + col * mod) * s, ph - (qy + (r + 1) * mod) * s, mod * s + 0.01, mod * s + 0.01, stroke=0, fill=1)
    c.save()
    os.remove(jpg)

    ok = [cv2.QRCodeDetector().detectAndDecode(cv2.imread(p))[0] for p in (png, prev)]
    print(f'A4 poster {cv.W}x{cv.H} (300 dpi, 3 mm bleed), content ends at {bottom / cv.H:.3f}, '
          f'QR {qsize / MM / 10:.1f} cm, decode: {ok}')


if __name__ == '__main__':
    instagram_post()
    poster_a4()
