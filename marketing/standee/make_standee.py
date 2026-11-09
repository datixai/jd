"""JD Travels roll-up standee for @jds_wonders (event sponsor standee).
Same sizes as the UOK MUN standee: 1890 px wide at 96 dpi, heights 3780 (1:2) and 4536 (1:2.4),
PDF pages 1417.5 x 2835 pt and 1417.5 x 3402 pt, no bleed.
Rendered here at 2x (192 dpi on the same page size) with the QR drawn as vectors in the PDF.
Run: python make_standee.py
"""
import os

import cv2
import numpy as np
import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
MEDIA = os.path.join(PROJ, 'public', 'media')
OUT = os.path.join(HERE, 'out')
FG = r'C:\Windows\Fonts'

URL = 'https://www.instagram.com/jds_wonders'
S = 2                      # render scale over the 1890 px reference width
W = 1890 * S

PINE = (15, 61, 46)
DARK = (10, 42, 32)
SAFFRON = (233, 162, 59)
SNOW = (247, 243, 234)
LAKE = (43, 111, 138)
WHITE = (255, 255, 255)
MUTED = (196, 214, 204)


def u(v):
    return int(round(v * S))


def font(name, size):
    return ImageFont.truetype(os.path.join(FG, name), u(size))


def text_w(d, txt, f, track=0):
    return d.textlength(txt, font=f) + u(track) * max(0, len(txt) - 1)


def draw_text(img, cx, y, txt, f, fill, track=0, shadow=None, anchor='c'):
    """Draw text with letter tracking; cx is the centre (anchor c) or the left edge (anchor l)."""
    d = ImageDraw.Draw(img)
    tw = text_w(d, txt, f, track)
    x = cx - tw / 2 if anchor == 'c' else cx
    if shadow:
        sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        xx = x
        for ch in txt:
            sd.text((xx + u(4), y + u(6)), ch, font=f, fill=(0, 0, 0, shadow))
            xx += sd.textlength(ch, font=f) + u(track)
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(u(14))))
    xx = x
    for ch in txt:
        d.text((xx, y), ch, font=f, fill=fill)
        xx += d.textlength(ch, font=f) + u(track)
    return tw


def cover(path, w, h, focus_y=0.5):
    im = Image.open(path).convert('RGB')
    sc = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * sc + 1), int(im.height * sc + 1)), Image.LANCZOS)
    x0 = (im.width - w) // 2
    y0 = int((im.height - h) * focus_y)
    return im.crop((x0, y0, x0 + w, y0 + h))


def rounded(im, r):
    m = Image.new('L', (im.width * 3, im.height * 3), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, m.width - 1, m.height - 1], r * 3, fill=255)
    out = im.convert('RGBA')
    out.putalpha(m.resize(im.size, Image.LANCZOS))
    return out


def soft_shadow(img, box, r, blur, alpha, dy):
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(sh).rounded_rectangle([x0, y0 + dy, x1, y1 + dy], r, fill=(0, 0, 0, alpha))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))


def logo_tile(size):
    """The JD Travels mark from public/logo.svg (64 x 64 viewBox), redrawn at print size."""
    k = size / 64 * 4
    t = Image.new('RGBA', (int(64 * k), int(64 * k)), (0, 0, 0, 0))
    d = ImageDraw.Draw(t)
    d.rounded_rectangle([0, 0, 64 * k - 1, 64 * k - 1], 14 * k, fill=PINE, outline=SAFFRON, width=int(2.2 * k))
    sw = int(4.5 * k)

    def poly(pts, col):
        pts = [(x * k, y * k) for x, y in pts]
        d.line(pts, fill=col, width=sw, joint='curve')
        for p in pts:
            d.ellipse([p[0] - sw / 2, p[1] - sw / 2, p[0] + sw / 2, p[1] + sw / 2], fill=col)

    poly([(9, 52), (22, 37), (29, 44), (40, 29), (55, 52)], SAFFRON)
    poly([(36.6, 33.6), (40, 29), (43.4, 33.6)], WHITE)
    f = ImageFont.truetype(os.path.join(FG, 'georgiab.ttf'), int(22 * k))
    d.text((32 * k, 28 * k), 'JD', font=f, fill=WHITE, anchor='ms')
    return t.resize((size, size), Image.LANCZOS)


def ig_glyph(size, col):
    """Generic camera glyph (rounded square, lens, dot)."""
    k = 4
    g = Image.new('RGBA', (size * k, size * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    s = size * k
    lw = int(s * 0.09)
    d.rounded_rectangle([lw / 2, lw / 2, s - lw / 2, s - lw / 2], s * 0.28, outline=col, width=lw)
    c = s / 2
    r = s * 0.22
    d.ellipse([c - r, c - r, c + r, c + r], outline=col, width=lw)
    dr = s * 0.06
    d.ellipse([s * 0.74 - dr, s * 0.26 - dr, s * 0.74 + dr, s * 0.26 + dr], fill=col)
    return g.resize((size, size), Image.LANCZOS)


def mountain_line(img, y, col, width):
    """Thin ridge line used as a divider."""
    d = ImageDraw.Draw(img)
    pts = [(-10, 1.0), (0.16, 0.55), (0.24, 0.75), (0.38, 0.15), (0.46, 0.45), (0.55, 0.0),
           (0.66, 0.6), (0.74, 0.4), (0.86, 0.85), (1.01, 0.5)]
    h = u(70)
    xy = [(max(-10, px * W), y + py * h) for px, py in pts]
    d.line(xy, fill=col, width=width, joint='curve')


def build(H1, name):
    H = H1 * S
    k = H1 / 3780.0
    img = Image.new('RGBA', (W, H), DARK + (255,))

    # background gradient dark -> pine -> dark
    g = np.linspace(0, 1, H)[:, None]
    mid = np.clip(1 - np.abs(g - 0.62) / 0.5, 0, 1)
    bg = np.array(DARK)[None, :] * (1 - mid) + np.array(PINE)[None, :] * mid
    bg = np.repeat(bg[:, None, :], W, axis=1).astype(np.uint8)
    img = Image.fromarray(bg).convert('RGBA')

    # hero photo (Chunda Valley) over the top part, softened and faded into the pine
    hero_h = int(H * (0.56 if k < 1.1 else 0.52))
    hero = cover(os.path.join(MEDIA, 'hero.webp'), W, hero_h, 0.35)
    hero = hero.filter(ImageFilter.GaussianBlur(u(2.2)))
    hero = Image.blend(hero, Image.new('RGB', hero.size, DARK), 0.18)
    a = np.ones((hero_h, W), np.float32)
    yy = np.linspace(0, 1, hero_h)[:, None]
    a *= np.clip((1 - yy) / 0.42, 0, 1) ** 1.3          # bottom fade
    top_dark = np.clip(1 - yy / 0.45, 0, 1) * 0.55       # darker sky behind the logo and headline
    hero_np = np.array(hero).astype(np.float32)
    hero_np = hero_np * (1 - top_dark[..., None]) + np.array(DARK)[None, None, :] * top_dark[..., None]
    layer = Image.fromarray(hero_np.astype(np.uint8)).convert('RGBA')
    layer.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    img.alpha_composite(layer)

    d = ImageDraw.Draw(img)
    gapk = 0.5 + (k - 1) * 6.0     # extra height of the tall version goes into the spacing

    # logo row
    y = u(max(120, 130 * gapk))
    tile = u(170)
    f_word = font('georgiab.ttf', 120)
    f_tag = font('segoeuib.ttf', 34)
    word_w = text_w(d, 'JD Travels', f_word)
    row_w = tile + u(40) + word_w
    x0 = (W - row_w) // 2
    img.alpha_composite(logo_tile(tile), (int(x0), y))
    tx = x0 + tile + u(40)
    draw_text(img, tx, y + u(4), 'JD ', f_word, WHITE, anchor='l', shadow=90)
    draw_text(img, tx + text_w(d, 'JD ', f_word), y + u(4), 'Travels', f_word, SAFFRON, anchor='l', shadow=90)
    draw_text(img, tx + u(4), y + u(134), 'TRAVEL WITH JD', f_tag, MUTED, track=9, anchor='l')

    # sponsor pill
    y += tile + u(70 * gapk)
    f_sp = font('segoeuib.ttf', 40)
    sp = 'PROUD SPONSOR'
    spw = text_w(d, sp, f_sp, 4)
    px0, px1 = W / 2 - spw / 2 - u(46), W / 2 + spw / 2 + u(46)
    pill = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(pill).rounded_rectangle([px0, y, px1, y + u(84)], u(42), fill=DARK + (175,),
                                           outline=SAFFRON, width=u(3))
    img.alpha_composite(pill)
    draw_text(img, W // 2, y + u(18), sp, f_sp, SNOW, track=4)

    # headline
    y += u(84) + u(80 * gapk)
    f_h1 = font('georgiab.ttf', 160)
    big = 300 if k > 1.1 else 270
    f_h2 = font('georgiab.ttf', big)
    draw_text(img, W // 2, y, 'Follow for', f_h1, WHITE, shadow=150)
    y += u(175)
    draw_text(img, W // 2, y, 'Kashmir', f_h2, SAFFRON, shadow=170)
    y += u(big)
    draw_text(img, W // 2, y, 'travel', f_h1, WHITE, shadow=150)
    y += u(200)

    f_sub = font('segoeuib.ttf', 56)
    for line in ('Nature and travel photography from', 'Azad Jammu Kashmir, Gilgit-Baltistan and Swat'):
        draw_text(img, W // 2, y, line, f_sub, SNOW, shadow=200)
        y += u(76)

    # Instagram style photo strip
    y += u(60 * gapk)
    tiles = ['kachura.webp', 'shangrila.webp', 'rainbowlake.webp']
    tw_ = u(500 if k > 1.1 else 420)
    gap = u(46)
    sx = (W - (3 * tw_ + 2 * gap)) // 2
    for i, f in enumerate(tiles):
        ph = cover(os.path.join(MEDIA, 'ig', f), tw_ - u(24), tw_ - u(24), 0.5)
        ph = ph.filter(ImageFilter.UnsharpMask(radius=u(2), percent=60, threshold=2))
        x = sx + i * (tw_ + gap)
        ty = y + (u(26) if i == 1 else 0)
        soft_shadow(img, (x, ty, x + tw_, ty + tw_), u(40), u(22), 150, u(14))
        frame = Image.new('RGBA', (tw_, tw_), (0, 0, 0, 0))
        ImageDraw.Draw(frame).rounded_rectangle([0, 0, tw_ - 1, tw_ - 1], u(40), fill=SNOW)
        img.alpha_composite(frame, (x, ty))
        img.alpha_composite(rounded(ph, u(30)), (x + u(12), ty + u(12)))
    labels = ['Kachura Lake', 'Shangrila', 'Rainbow Lake']
    f_lab = font('segoeuib.ttf', 34)
    y += tw_ + u(26) + u(22)
    for i, lab in enumerate(labels):
        draw_text(img, sx + i * (tw_ + gap) + tw_ // 2, y + (u(26) if i == 1 else 0), lab, f_lab, MUTED, track=3)
    y += u(80)

    # QR card
    y += u(60 * gapk)
    qr = segno.make(URL, error='h', micro=False)
    n = qr.symbol_size(border=0)[0]
    mod = u(880) // n
    qsize = mod * n
    quiet = mod * 4
    card_w = qsize + 2 * quiet + u(160)
    head_h = u(140)
    foot_h = u(250)
    card_h = head_h + qsize + 2 * quiet + foot_h
    cx0 = (W - card_w) // 2
    cy0 = y
    soft_shadow(img, (cx0, cy0, cx0 + card_w, cy0 + card_h), u(60), u(40), 190, u(24))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([cx0, cy0, cx0 + card_w, cy0 + card_h], u(60), fill=WHITE)
    d.rounded_rectangle([cx0, cy0, cx0 + card_w, cy0 + head_h + u(60)], u(60), fill=SAFFRON)
    d.rectangle([cx0, cy0 + head_h, cx0 + card_w, cy0 + head_h + u(62)], fill=WHITE)
    d.rounded_rectangle([cx0 + u(16), cy0 + u(16), cx0 + card_w - u(16), cy0 + card_h - u(16)], u(46),
                        outline=SAFFRON, width=u(4))
    f_scan = font('georgiab.ttf', 92)
    draw_text(img, W // 2, cy0 + u(14), 'Scan and follow', f_scan, DARK)

    qx = (W - qsize) // 2
    qy = cy0 + head_h + quiet
    matrix = np.array([[1 if v else 0 for v in row] for row in qr.matrix], np.uint8)
    for r in range(n):
        for c in range(n):
            if matrix[r, c]:
                d.rectangle([qx + c * mod, qy + r * mod, qx + (c + 1) * mod - 1, qy + (r + 1) * mod - 1], fill=DARK)
    qr_box = (qx, qy, mod, n)

    fy = qy + qsize + quiet - u(10)
    f_handle = font('georgiab.ttf', 108)
    glyph = u(110)
    hw = text_w(d, '@jds_wonders', f_handle)
    gx = int(W / 2 - (glyph + u(30) + hw) / 2)
    img.alpha_composite(ig_glyph(glyph, LAKE), (gx, fy + u(22)))
    draw_text(img, gx + glyph + u(30), fy, '@jds_wonders', f_handle, PINE, anchor='l')
    f_on = font('segoeuib.ttf', 40)
    draw_text(img, W // 2, fy + u(165), 'ON INSTAGRAM', f_on, LAKE, track=12)

    # footer
    y = cy0 + card_h + u(80 * gapk)
    mountain_line(img, y, SAFFRON + (255,), u(5))
    y += u(120)
    f_ft = font('segoeuib.ttf', 46)
    draw_text(img, W // 2, y, 'Trips across Kashmir with families from Kotli, Mirpur and abroad', f_ft, MUTED)
    draw_text(img, W // 2, y + u(70), 'instagram.com/jds_wonders', f_ft, SAFFRON, track=2)
    bottom = y + u(130)

    os.makedirs(OUT, exist_ok=True)
    rgb = img.convert('RGB')
    png = os.path.join(OUT, name + '.png')
    rgb.save(png, dpi=(96 * S, 96 * S))
    rgb.resize((W // 6, H // 6), Image.LANCZOS).save(os.path.join(OUT, name + '_preview.jpg'), quality=88)

    # PDF: same page size as the UOK MUN file, photo layer as high quality JPEG, QR as vectors
    pw, ph_ = W / (96 * S) * 72, H / (96 * S) * 72
    jpg = os.path.join(OUT, name + '_bg.jpg')
    rgb.save(jpg, quality=95, subsampling=0)
    pdf = os.path.join(OUT, name + '.pdf')
    c = canvas.Canvas(pdf, pagesize=(pw, ph_))
    c.setTitle('JD Travels standee, @jds_wonders')
    c.drawImage(ImageReader(jpg), 0, 0, pw, ph_)
    pt = pw / W
    qx, qy, mod, n = qr_box
    c.setFillColorRGB(1, 1, 1)
    c.rect((qx - mod) * pt, ph_ - (qy + qsize + mod) * pt, (qsize + 2 * mod) * pt, (qsize + 2 * mod) * pt,
           stroke=0, fill=1)
    c.setFillColorRGB(*[v / 255 for v in DARK])
    for r in range(n):
        for col in range(n):
            if matrix[r, col]:
                c.rect((qx + col * mod) * pt, ph_ - (qy + (r + 1) * mod) * pt, mod * pt + 0.01, mod * pt + 0.01,
                       stroke=0, fill=1)
    c.save()
    os.remove(jpg)

    # decode check on the full PNG and on the small preview
    ok = []
    for p in (png, os.path.join(OUT, name + '_preview.jpg')):
        im = cv2.imread(p)
        val, _, _ = cv2.QRCodeDetector().detectAndDecode(im)
        ok.append(val)
    cm = qsize / (96 * S) * 2.54
    print(f'{name}: {W}x{H}, content ends at {bottom / H:.3f} of height, QR {n} modules, '
          f'{cm:.1f} cm on the PDF page ({cm * 2.5 * 30.48 / (W / (96 * S) * 2.54):.1f} cm if printed 2.5 ft wide), '
          f'decode: {ok}')


if __name__ == '__main__':
    build(3780, 'JDTravels_standee_1890x3780')
    build(4536, 'JDTravels_standee_1890x4536')
