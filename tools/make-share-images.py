# Branded 1200x630 share images: navy illustration on the right, white panel with logo and page text.
# Usage: python3 tools/make-share-images.py <PlusJakartaSans[wght].ttf> client/public/img/share-art.jpg
# (font: github.com/google/fonts/tree/main/ofl/plusjakartasans). Needs Pillow.
import sys
from PIL import Image, ImageDraw, ImageFont
ROOT = 'client/public/img/'
FONT = sys.argv[1]
def font(size, weight):
    f = ImageFont.truetype(FONT, size); f.set_variation_by_name(weight); return f
base = Image.open(sys.argv[2]).convert('RGB')  # the original illustration
logo = Image.open(ROOT + 'logo.png').convert('RGBA')
PAGES = {
  'share':            ('JEE, NEET & Foundation Coaching', 'Barasat · Madhyamgram · New Town, Kolkata'),
  'share-jee':        ('JEE Coaching in Madhyamgram, Kolkata', 'JEE Main & Advanced · Physics, Chemistry, Maths'),
  'share-neet':       ('NEET Coaching in Madhyamgram, Kolkata', 'NEET-UG · NCERT-focused Biology, Physics, Chemistry'),
  'share-foundation': ('Foundation Course for Class 8, 9 & 10', 'Maths, Science, reasoning and olympiad preparation'),
  'share-blog':       ('Exam Tips & Study Plans', 'Guidance for JEE, NEET and Class 8 to 10 students'),
}
def wrap(draw, text, f, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
for name, (title, sub) in PAGES.items():
    im = Image.new('RGB', (1200, 630), (11, 29, 69))
    art = base.crop((300, 0, 900, 630))  # the building, centred
    im.paste(art, (640, 0))
    d = ImageDraw.Draw(im)
    panel_w = 640
    d.rectangle([0, 0, panel_w, 630], fill=(255, 255, 255))
    d.polygon([(panel_w, 0), (panel_w + 60, 0), (panel_w, 630)], fill=(255, 255, 255))   # slanted edge like the site
    d.polygon([(panel_w + 60, 0), (panel_w + 78, 0), (panel_w + 18, 630), (panel_w, 630)], fill=(217, 10, 10))
    lw = 420; l = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    im.paste(l, (64, 70), l)
    ft = font(50, 'ExtraBold'); y = 200
    for line in wrap(d, title, ft, panel_w - 110):
        d.text((64, y), line, font=ft, fill=(10, 21, 48)); y += 62
    d.rectangle([64, y + 14, 124, y + 19], fill=(217, 10, 10)); y += 44
    fs = font(26, 'Medium')
    for line in wrap(d, sub, fs, panel_w - 110):
        d.text((64, y), line, font=fs, fill=(62, 72, 96)); y += 36
    d.text((64, 556), 'www.hawkacademe.com', font=font(24, 'Bold'), fill=(217, 10, 10))
    out = ROOT + name + ('.jpg')
    im.save(out if name != 'share' else ROOT + 'share.jpg', quality=86, optimize=True, progressive=True)
    print(name, im.size)
