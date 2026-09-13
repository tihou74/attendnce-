#!/usr/bin/env python3
"""
يولّد أيقونة مميّزة لكل تطبيق من تطبيقات النظام الأربعة — ببايثون الصافي، فلا
Pillow ولا numpy ولا ImageMagick في هذه البيئة.

Generates a DISTINCT icon set for each of the four installed apps.

المشكلة التي يحلّها:
    الأربعة كانت تستخدم ملفات الأيقونات نفسها (icons/icon-192.png …)، فظهرت
    على شاشة الهاتف متشابهة تمامًا ولم يعرف المستخدم أيّها يفتح.

الطريقة:
    التمييز بأمرين معًا لا بأمر واحد، لأن اللون وحده لا يكفي لمن لا يميّز
    الألوان جيدًا، والشكل وحده لا يكفي في حجم 48 بكسل على الشاشة:
      1) لون خلفية مختلف لكل تطبيق.
      2) رمز هندسي مختلف يُرسم حسابيًا (ساعة · أعمدة · شبكة · عملات).

    الرمز يُرسم كقناع شفافية بدقة عالية (1024) ثم يُصغَّر بمتوسط صندوقي، وهذا
    ما يعطي الحواف الناعمة بلا مكتبة رسم.

المخرج لكل تطبيق: <slug>-192.png · <slug>-512.png ·
                  <slug>-maskable-512.png · <slug>-touch.png
"""

import os
import struct
import zlib

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
OUT_DIR = os.path.join(REPO_ROOT, 'icons')

MASK_RES = 1024  # دقة رسم القناع قبل التصغير

# نسب الحجم: العادية 0.62، والقابلة للقصّ 0.46 لأن النظام قد يقصّها دائرةً
TARGETS = [
    ('{slug}-192.png', 192, 0.62),
    ('{slug}-512.png', 512, 0.62),
    ('{slug}-maskable-512.png', 512, 0.46),
    ('{slug}-touch.png', 180, 0.62),
]


# ---------------------------------------------------------------- الأشكال
# كل دالة تستقبل إحداثيات في المجال 0..1 وتعيد True إذا كانت النقطة داخل الرمز.

def glyph_clock(x, y):
    """ساعة: حلقة + عقربان — للحضور والانصراف."""
    dx, dy = x - 0.5, y - 0.5
    d = (dx * dx + dy * dy) ** 0.5
    if 0.335 <= d <= 0.425:          # الحلقة
        return True
    if d > 0.40:
        return False
    # عقرب الساعات: من المركز إلى أعلى
    if abs(dx) <= 0.038 and -0.27 <= dy <= 0.02:
        return True
    # عقرب الدقائق: من المركز إلى اليمين
    if abs(dy) <= 0.038 and -0.02 <= dx <= 0.22:
        return True
    return False


def glyph_bars(x, y):
    """ثلاثة أعمدة صاعدة + خط قاعدة — لتقرير المبيعات."""
    if 0.13 <= x <= 0.87 and 0.845 <= y <= 0.895:   # القاعدة
        return True
    for x0, x1, top in ((0.17, 0.36, 0.61), (0.405, 0.595, 0.43), (0.64, 0.83, 0.25)):
        if x0 <= x <= x1 and top <= y <= 0.825:
            return True
    return False


def glyph_grid(x, y):
    """أربعة مربعات — لوحة الإدارة."""
    for x0, x1 in ((0.15, 0.46), (0.54, 0.85)):
        for y0, y1 in ((0.15, 0.46), (0.54, 0.85)):
            if x0 <= x <= x1 and y0 <= y <= y1:
                return True
    return False


def glyph_coins(x, y):
    """
    ثلاث عملات مكدّسة — الأرصدة.
    الفراغ بين العملات مقصود: بنصف ارتفاع 0.105 كانت الحدود تتلامس فتظهر كتلة
    بيضاء واحدة في مقاس صغير. 0.085 مع تباعد 0.22 يترك فجوة واضحة بينها.
    """
    for cy in (0.28, 0.50, 0.72):
        dx, dy = (x - 0.5) / 0.315, (y - cy) / 0.085
        if dx * dx + dy * dy <= 1.0:
            return True
    return False


# ---------------------------------------------------------------- التطبيقات
# أيقونات مرسومة حسابيًا
APPS = [
    # slug        الخلفية            الرمز              الدالة        الوصف
    ('attendance', (26, 37, 47),   (212, 175, 55),  glyph_clock, 'كيوسك الموظفين — كحلي + ساعة ذهبية'),
    ('report',     (24, 100, 171), (255, 255, 255), glyph_bars,  'تقرير المديرين — أزرق + أعمدة بيضاء'),
    ('balances',   (21, 128, 61),  (255, 255, 255), glyph_coins, 'الأرصدة — أخضر + عملات بيضاء'),
]

# أيقونات مبنية على شعار المجموعة نفسه — بطلب الإدارة للوحة الإدارة.
# تُبنى بإعادة استخدام خط أنابيب make_icons.py (فك PNG وعزل الرمز عن نص الاسم)،
# فلا يُكرَّر ذلك المنطق هنا.
#
# الخلفية بنفسجية لا كحلية عن قصد: الكحلي مأخوذ لكيوسك الموظفين، ولو صارت
# أيقونتان كحليتين بحبر ذهبي لعاد المشكل نفسه — أيقونتان لا تُفرَّقان في مقاس
# صغير على الشاشة. البنفسجي يُبقي التمييز مع بقاء الشعار هو الرمز.
LOGO_APPS = [
    ('admin', (67, 56, 202), 'لوحة الإدارة — بنفسجي + شعار مجموعة الشيخة'),
]


def render_mask(fn, res):
    """يرسم الرمز كقناع شفافية 0/1 بدقة res."""
    mask = bytearray(res * res)
    for iy in range(res):
        y = (iy + 0.5) / res
        row = iy * res
        for ix in range(res):
            if fn((ix + 0.5) / res, y):
                mask[row + ix] = 1
    return mask


def scale_mask(mask, res, out):
    """تصغير بمتوسط صندوقي — هذا ما يعطي الحواف الناعمة."""
    vals = [0.0] * (out * out)
    for oy in range(out):
        y0, y1 = oy * res // out, max(oy * res // out + 1, (oy + 1) * res // out)
        for ox in range(out):
            x0, x1 = ox * res // out, max(ox * res // out + 1, (ox + 1) * res // out)
            s = n = 0
            for y in range(y0, y1):
                row = y * res
                s += sum(mask[row + x0:row + x1])
                n += (x1 - x0)
            vals[oy * out + ox] = s / n if n else 0.0
    return vals


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


def build(mask_scaled, box, size, bg, fg):
    """يدمج القناع المصغَّر وسط مربع size×size."""
    canvas = [bg] * (size * size)
    off = (size - box) // 2
    for y in range(box):
        for x in range(box):
            a = mask_scaled[y * box + x]
            if a <= 0.0:
                continue
            k = (off + y) * size + (off + x)
            br, bgc, bb = canvas[k]
            canvas[k] = (fg[0] * a + br * (1 - a),
                         fg[1] * a + bgc * (1 - a),
                         fg[2] * a + bb * (1 - a))
    return canvas


def load_logo_mark():
    """
    يعيد (بكسلات RGBA، عرض، ارتفاع) لرمز الشعار وحده بلا نص الاسم.
    يستورد make_icons.py المجاور بدل تكرار فك ترميز PNG وعزل الرمز.
    """
    import importlib.util
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'make_icons.py')
    spec = importlib.util.spec_from_file_location('mk_logo', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    mod.ensure_logo()
    width, height, rows = mod.read_png_rgba(mod.SRC)
    w, h, sr, sg, sb, sa, cnt = mod.accumulate(width, height, rows, mod.INTERMEDIATE_WIDTH)
    logo = mod.to_rgba_pixels(w, h, sr, sg, sb, sa, cnt)

    bx0, by0, bx1, by1 = mod.opaque_bbox(logo, w, h)
    logo, w, h = mod.crop(logo, w, h, bx0, by0, bx1, by1)

    # نص اسم المجموعة غير مقروء في مقاس أيقونة ويُصغّر الرمز بلا داعٍ
    isolated = mod.isolate_mark(logo, w, h)
    if isolated:
        logo, w, h = isolated
    return mod, logo, w, h


def build_logo_icon(mod, logo, lw, lh, size, ratio, bg):
    """يضع الشعار بألوانه الأصلية وسط مربع بالخلفية المطلوبة."""
    return mod.build_icon(logo, lw, lh, size, ratio, bg)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f'دقة رسم القناع: {MASK_RES}×{MASK_RES}\n')

    for slug, bg, fg, fn, desc in APPS:
        print(f'{slug:11} {desc}')
        mask = render_mask(fn, MASK_RES)
        ink = sum(mask)
        if not ink:
            raise SystemExit(f'!! الرمز {slug} فارغ — تحقّق من دالته')
        print(f'            نسبة الحبر في القناع: {ink * 100 / (MASK_RES * MASK_RES):.1f}%')

        for pattern, size, ratio in TARGETS:
            box = max(1, int(size * ratio))
            scaled = scale_mask(mask, MASK_RES, box)
            canvas = build(scaled, box, size, bg, fg)
            name = pattern.format(slug=slug)
            blob = encode_png_rgb(canvas, size, size)
            open(os.path.join(OUT_DIR, name), 'wb').write(blob)
            print(f'            {name:32} {size}x{size}  {len(blob) / 1024:6.1f} KB')
        print()

    if LOGO_APPS:
        print('تحميل شعار المجموعة وعزل الرمز...')
        mod, logo, lw, lh = load_logo_mark()
        print(f'            رمز الشعار: {lw}x{lh}\n')
        for slug, bg, desc in LOGO_APPS:
            print(f'{slug:11} {desc}')
            for pattern, size, ratio in TARGETS:
                canvas = build_logo_icon(mod, logo, lw, lh, size, ratio, bg)
                name = pattern.format(slug=slug)
                blob = encode_png_rgb(canvas, size, size)
                open(os.path.join(OUT_DIR, name), 'wb').write(blob)
                print(f'            {name:32} {size}x{size}  {len(blob) / 1024:6.1f} KB')
            print()

    print('تم. حدّث بعدها الـmanifests ووسوم <link rel="icon"> في الصفحات الأربعة.')


if __name__ == '__main__':
    main()
