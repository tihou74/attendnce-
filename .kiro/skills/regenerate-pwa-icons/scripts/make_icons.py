#!/usr/bin/env python3
"""
يولّد أيقونات PWA من شعار المجموعة ببايثون الصافي — لا Pillow ولا numpy ولا
ImageMagick في هذه البيئة، فكُتب فك ترميز PNG وإعادة ترميزه يدويًا.

Generates the PWA icons from the group logo in pure Python.

المدخل : .icons/logo.png  (RGBA 8-bit غير متشابك)
المخرج : icons/icon-192.png · icon-512.png · icon-maskable-512.png ·
         apple-touch-icon.png

الطريقة:
  1) فك ضغط IDAT ثم إلغاء المرشّحات صفًا بصف (Sub/Up/Average/Paeth) — لا يمكن
     تخطي أي صف لأن كل صف يعتمد على الذي قبله.
  2) تجميع الشعار في مخزن وسيط بعرض 1024 مع الحفاظ على النسبة، بجمع القيم
     مضروبةً في الشفافية (premultiplied) حتى تبقى الحواف نظيفة.
  3) اختيار لون الخلفية بناءً على سطوع الشعار نفسه (شعار فاتح ← خلفية داكنة).
  4) لكل مقاس: تصغير المخزن الوسيط، ودمجه على مربع بالخلفية، ثم ترميزه PNG.
"""

import os
import struct
import zlib

# الشعار يُجلب من مستودع الأصول عند الحاجة — لا يُخزَّن في هذا المستودع.
LOGO_URL = ('https://raw.githubusercontent.com/tihou74/'
            'alsheikha-attendance-admin/main/al-sheikha-group-logo.png.png')
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
SRC = os.path.join(REPO_ROOT, '.icons', 'logo.png')
OUT_DIR = os.path.join(REPO_ROOT, 'icons')


def ensure_logo():
    if os.path.exists(SRC):
        return
    import urllib.request
    os.makedirs(os.path.dirname(SRC), exist_ok=True)
    print('جلب الشعار من مستودع الأصول...')
    urllib.request.urlretrieve(LOGO_URL, SRC)

INTERMEDIATE_WIDTH = 1024
ROW_STEP = 2  # نأخذ كل صف ثانٍ: تصغير 4001→1024 يعطي عيّنات كافية للنعومة


def read_png_rgba(path):
    """يعيد (العرض، الارتفاع، مولّد صفوف RGBA غير مُرشَّحة)."""
    data = open(path, 'rb').read()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise SystemExit('!! الملف ليس PNG')

    pos, idat = 8, bytearray()
    width = height = None
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        if ctype == b'IHDR':
            width, height, depth, color, _comp, _filt, interlace = struct.unpack(
                '>IIBBBBB', data[pos + 8:pos + 21])
            if depth != 8 or color != 6 or interlace != 0:
                raise SystemExit(
                    f'!! مدعوم فقط RGBA 8-bit غير متشابك (وجدت depth={depth} '
                    f'color={color} interlace={interlace})')
        elif ctype == b'IDAT':
            idat += data[pos + 8:pos + 8 + length]
        pos += 12 + length

    raw = zlib.decompress(bytes(idat))
    stride = width * 4

    def rows():
        prev = bytearray(stride)
        offset = 0
        for _y in range(height):
            ftype = raw[offset]
            cur = bytearray(raw[offset + 1:offset + 1 + stride])
            offset += 1 + stride

            if ftype == 0:
                pass
            elif ftype == 1:  # Sub — يعتمد على الجار الأيسر، تسلسلي
                for i in range(4, stride):
                    cur[i] = (cur[i] + cur[i - 4]) & 255
            elif ftype == 2:  # Up — لا يعتمد على اليسار، فنسرّعه بـ zip
                cur = bytearray([(a + b) & 255 for a, b in zip(cur, prev)])
            elif ftype == 3:  # Average
                for i in range(stride):
                    left = cur[i - 4] if i >= 4 else 0
                    cur[i] = (cur[i] + ((left + prev[i]) >> 1)) & 255
            elif ftype == 4:  # Paeth
                for i in range(stride):
                    a = cur[i - 4] if i >= 4 else 0
                    b = prev[i]
                    c = prev[i - 4] if i >= 4 else 0
                    p = a + b - c
                    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                    pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                    cur[i] = (cur[i] + pr) & 255
            else:
                raise SystemExit(f'!! نوع مرشّح غير معروف: {ftype}')

            prev = cur
            yield cur

    return width, height, rows()


def accumulate(width, height, rows, dst_w):
    """يصغّر الصورة إلى dst_w مع جمع القيم مضروبةً في الشفافية."""
    dst_h = max(1, round(height * dst_w / width))
    size = dst_w * dst_h
    sum_r = [0] * size
    sum_g = [0] * size
    sum_b = [0] * size
    sum_a = [0] * size
    count = [0] * size

    x_map = [x * dst_w // width for x in range(width)]

    for y, row in enumerate(rows):
        if y % ROW_STEP:
            continue
        base = (y * dst_h // height) * dst_w
        i = 0
        for x in range(width):
            a = row[i + 3]
            k = base + x_map[x]
            if a:
                sum_r[k] += row[i] * a
                sum_g[k] += row[i + 1] * a
                sum_b[k] += row[i + 2] * a
                sum_a[k] += a
            count[k] += 1
            i += 4

    return dst_w, dst_h, sum_r, sum_g, sum_b, sum_a, count


def to_rgba_pixels(w, h, sum_r, sum_g, sum_b, sum_a, count):
    """يحوّل المجاميع إلى قائمة (r, g, b, alpha 0..1)."""
    px = []
    for k in range(w * h):
        n = count[k]
        sa = sum_a[k]
        if not n or not sa:
            px.append((0, 0, 0, 0.0))
            continue
        px.append((sum_r[k] / sa, sum_g[k] / sa, sum_b[k] / sa, (sa / n) / 255.0))
    return px


def box_scale(px, w, h, tw, th):
    """تصغير صندوقي لقائمة البكسلات مع الحفاظ على الشفافية."""
    out = []
    for ty in range(th):
        y0, y1 = ty * h // th, max(ty * h // th + 1, (ty + 1) * h // th)
        for tx in range(tw):
            x0, x1 = tx * w // tw, max(tx * w // tw + 1, (tx + 1) * w // tw)
            r = g = b = a = 0.0
            n = 0
            for y in range(y0, y1):
                row = y * w
                for x in range(x0, x1):
                    pr, pg, pb, pa = px[row + x]
                    r += pr * pa
                    g += pg * pa
                    b += pb * pa
                    a += pa
                    n += 1
            if a > 0:
                out.append((r / a, g / a, b / a, a / n))
            else:
                out.append((0, 0, 0, 0.0))
    return out


def encode_png_rgb(pixels, w, h):
    """يرمّز قائمة (r,g,b) إلى PNG بلا شفافية (color type 2)."""
    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter None
        row = y * w
        for x in range(w):
            r, g, b = pixels[row + x]
            raw += bytes((int(r + 0.5) & 255, int(g + 0.5) & 255, int(b + 0.5) & 255))

    def chunk(ctype, payload):
        return (struct.pack('>I', len(payload)) + ctype + payload +
                struct.pack('>I', zlib.crc32(ctype + payload) & 0xffffffff))

    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
            + chunk(b'IEND', b''))


def crop(px, w, h, x0, y0, x1, y1):
    """يقتصّ مستطيلًا (شامل الحدود) ويعيد (بكسلات، عرض، ارتفاع)."""
    cw, ch = x1 - x0 + 1, y1 - y0 + 1
    out = []
    for y in range(y0, y1 + 1):
        row = y * w
        out.extend(px[row + x0:row + x1 + 1])
    return out, cw, ch


def opaque_bbox(px, w, h, thresh=0.25):
    """أصغر مستطيل يحيط بكل البكسلات غير الشفافة — لإزالة هوامش المصدر."""
    minx, miny, maxx, maxy = w, h, -1, -1
    for y in range(h):
        row = y * w
        for x in range(w):
            if px[row + x][3] > thresh:
                if x < minx:
                    minx = x
                if x > maxx:
                    maxx = x
                if y < miny:
                    miny = y
                if y > maxy:
                    maxy = y
    if maxx < 0:
        return 0, 0, w - 1, h - 1
    return minx, miny, maxx, maxy


def isolate_mark(px, w, h, thresh=0.25):
    """
    شعار المجموعة عبارة عن رمز في الأعلى ونص الاسم أسفله. النص يصبح غير مقروء
    في مقاس 192 بكسل ويُصغّر الرمز بلا داعٍ، فنعزل الرمز وحده.

    الطريقة: نقسّم الصورة إلى «شرائح» من الصفوف المتصلة التي فيها حبر، ونختار
    الشريحة الأكثر حبرًا — وهي الرمز. هذا أفضل من قصّ نسبة ثابتة لأنه يعمل مع
    أي شعار بلا أرقام مكتوبة يدويًا.
    """
    ink_rows = []
    for y in range(h):
        row = y * w
        n = 0
        for x in range(w):
            if px[row + x][3] > thresh:
                n += 1
        ink_rows.append(n)

    bands, start = [], None
    for y, n in enumerate(ink_rows):
        if n and start is None:
            start = y
        elif not n and start is not None:
            bands.append((start, y - 1))
            start = None
    if start is not None:
        bands.append((start, h - 1))

    if len(bands) < 2:
        return None  # شعار واحد متصل — لا شيء لعزله

    best = max(bands, key=lambda b: sum(ink_rows[b[0]:b[1] + 1]))
    y0, y1 = best
    # نضيّق أفقيًا داخل الشريحة المختارة
    sub, sw, sh = crop(px, w, h, 0, y0, w - 1, y1)
    bx0, by0, bx1, by1 = opaque_bbox(sub, sw, sh, thresh)
    return crop(sub, sw, sh, bx0, by0, bx1, by1)


def build_icon(logo_px, lw, lh, size, content_ratio, bg):
    """يضع الشعار وسط مربع size×size بنسبة محتوى content_ratio على خلفية bg."""
    box = max(1, int(size * content_ratio))
    if lw / lh >= 1:
        cw = box
        ch = max(1, round(box * lh / lw))
    else:
        ch = box
        cw = max(1, round(box * lw / lh))

    content = box_scale(logo_px, lw, lh, cw, ch)
    ox, oy = (size - cw) // 2, (size - ch) // 2

    canvas = [bg] * (size * size)
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = content[y * cw + x]
            if a <= 0:
                continue
            k = (oy + y) * size + (ox + x)
            br, bg_, bb = canvas[k]
            canvas[k] = (r * a + br * (1 - a),
                         g * a + bg_ * (1 - a),
                         b * a + bb * (1 - a))
    return canvas


def main():
    ensure_logo()
    print('فك ترميز الشعار (43 ميغابايت)...')
    width, height, rows = read_png_rgba(SRC)
    w, h, sr, sg, sb, sa, cnt = accumulate(width, height, rows, INTERMEDIATE_WIDTH)
    logo = to_rgba_pixels(w, h, sr, sg, sb, sa, cnt)
    print(f'المخزن الوسيط: {w}x{h}')

    # 1) إزالة هوامش المصدر الشفافة
    bx0, by0, bx1, by1 = opaque_bbox(logo, w, h)
    logo, w, h = crop(logo, w, h, bx0, by0, bx1, by1)
    print(f'بعد قصّ الهوامش : {w}x{h}')

    # 2) عزل الرمز عن نص الاسم (النص غير مقروء في مقاس أيقونة)
    isolated = isolate_mark(logo, w, h)
    if isolated:
        logo, w, h = isolated
        print(f'بعد عزل الرمز   : {w}x{h}  (نص الاسم مُستثنى — غير مقروء بهذا المقاس)')
    else:
        print('لم يُعزل رمز — الشعار كتلة واحدة')

    opaque = [(r, g, b) for r, g, b, a in logo if a > 0.5]
    lum = sum(0.2126 * r + 0.7152 * g + 0.0722 * b for r, g, b in opaque) / max(1, len(opaque))
    print(f'متوسط سطوع الرمز: {lum:.0f}/255')

    # الرمز ذهبي متوسط السطوع؛ على خلفية كريمية يبدو باهتًا وضعيف التباين، وعلى
    # كحلي داكن يبرز بقوة ويبدو أرقى — وهو ما يناسب أيقونة تُرى بحجم صغير.
    bg = (26, 37, 47)  # #1a252f — نفس كحلي عناوين النظام
    print('الخلفية         : كحلي داكن #1a252f (أعلى تباين للرمز الذهبي)')

    os.makedirs(OUT_DIR, exist_ok=True)
    targets = [
        ('icon-192.png', 192, 0.82),
        ('icon-512.png', 512, 0.82),
        # maskable: النظام قد يقصّها دائرةً، فالمنطقة الآمنة هي 80% الوسطى فقط
        ('icon-maskable-512.png', 512, 0.60),
        ('apple-touch-icon.png', 180, 0.82),
    ]
    for name, size, ratio in targets:
        canvas = build_icon(logo, w, h, size, ratio, bg)
        blob = encode_png_rgb(canvas, size, size)
        path = os.path.join(OUT_DIR, name)
        open(path, 'wb').write(blob)
        print(f'  {name:26} {size}x{size}  {len(blob) / 1024:6.1f} KB')

    print('تم.')


if __name__ == '__main__':
    main()
