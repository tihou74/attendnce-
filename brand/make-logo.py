#!/usr/bin/env python3
"""
يُحوّل ملف شعار الشيخة ستايل (PDF أو صورة) إلى الملفات التي تستعملها الصفحات.

⚠️ لماذا سكربت لا خطوات يدوية: الشعار سيُعاد توليده كلّما وصلت نسخة أحدث من
المصمّم، ويجب أن تخرج بنفس المقاسات وبنفس القصّ في كل مرة — وإلا ظهر بحجمٍ
مختلف في شاشة وشاشة.

⚠️ والخلفية تُجعل **بيضاء صريحة** لا شفافة: الشعار ذهبيّ فاتح، فعلى سطحٍ غامق
يكاد يختفي. والصفحات تضعه داخل إطار أبيض لهذا السبب نفسه.

الاستعمال:
    python3 brand/make-logo.py <المصدر.pdf|png|jpg>

يُخرج:
    brand/al-sheikha-style-logo.png     الشعار الكامل (شفّاف الحواف، للترويسة)
    icons/abaya-192.png   / -512 / -maskable-512 / -touch      أيقونة شاشة البياعة
    icons/abayaview-192.png / -512 / -maskable-512 / -touch    أيقونة شاشة العرض
"""
import sys, os, io

SRC = sys.argv[1] if len(sys.argv) > 1 else None
if not SRC or not os.path.exists(SRC):
    sys.exit("اكتب مسار ملف الشعار: python3 brand/make-logo.py <file.pdf|png>")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "brand")
ICONS = os.path.join(ROOT, "icons")
os.makedirs(BRAND, exist_ok=True)
os.makedirs(ICONS, exist_ok=True)

from PIL import Image

# ---- 1) قراءة المصدر بدقّة عالية ------------------------------------------
if SRC.lower().endswith(".pdf"):
    import fitz  # pymupdf
    doc = fitz.open(SRC)
    # ⚠️ 600 نقطة/بوصة لا 72: الشعار خطٌّ عربي رقيق، وتصغيرُ صورةٍ كبيرة أنظف
    # بمراحل من تكبير صورةٍ صغيرة — والخطوط الرقيقة أول ما يتهشّم.
    pix = doc.load_page(0).get_pixmap(dpi=600, alpha=False)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    doc.close()
else:
    img = Image.open(SRC)

img = img.convert("RGB")

# ---- 2) قصّ الفراغ الأبيض المحيط ------------------------------------------
# ⚠️ ملفّ المصمّم صفحة A4 والشعار في وسطها، فلو استُعمل كما هو ظهر الشعار نقطةً
# صغيرة في وسط مربّع فارغ. والقصّ يُقاس بعتبةٍ لا بلون مطابق تمامًا، لأن حواف
# الخطّ مموّهة (anti-aliased) فليست بيضاء نقيّة ولا ذهبية نقيّة.
gray = img.convert("L")
mask = gray.point(lambda v: 255 if v < 245 else 0)
box = mask.getbbox()
if box:
    pad = int(max(img.size) * 0.02)          # هامشٌ يسير حتى لا يلتصق بالحافة
    l, t, r, b = box
    img = img.crop((max(0, l - pad), max(0, t - pad),
                    min(img.width, r + pad), min(img.height, b + pad)))
print(f"بعد القصّ: {img.width}x{img.height}")

# ---- 3) الشعار الكامل للترويسة -------------------------------------------
full = img.copy()
full.thumbnail((1024, 1024), Image.LANCZOS)
full.save(os.path.join(BRAND, "al-sheikha-style-logo.png"), "PNG", optimize=True)
print("brand/al-sheikha-style-logo.png")

# ---- 4) الرمز وحده للأيقونات (بلا كلمة AL SHEIKHA STYLE) ------------------
# ⚠️⚠️ أيقونة 192 بكسل لا تتّسع للشعار كاملًا: سطر «AL SHEIKHA STYLE» يصير خطًّا
# رماديًّا لا يُقرأ، ويسرق نصف المساحة من الرمز فيصغر الرمز حتى لا يُميَّز على
# شاشة الهاتف. وهذا ما ظهر فعلًا في أول توليد. فالأيقونة تحمل **الرمز وحده**،
# وهو المتعارف عليه في تصميم الأيقونات.
#
# وكيف يُعرف سطر الكلمة من الرمز بلا تحديد يدوي: الصفوف التي فيها حبرٌ تُجمَّع
# في نطاقات متّصلة يفصلها بياض. وسطر الكلمة **نطاقٌ منفصل ورقيق** في الأسفل.
# فإن كان آخر نطاق أقصر من 18% من الطول ويفصله بياضٌ واضح، فهو الكلمة فتُقصّ.
# ⚠️ وإن لم يتحقّق الشرط لا يُقصّ شيء: الأيقونة بشعارٍ كامل أهون من رمزٍ مقطوع.
def emblem_only(im):
    g = im.convert("L")
    w, h = g.size
    px = g.load()
    step = max(1, w // 400)                      # عيّنة من الصفّ، لا كل بكسل
    inked = [any(px[x, y] < 245 for x in range(0, w, step)) for y in range(h)]
    bands, start = [], None
    for y, has in enumerate(inked):
        if has and start is None:
            start = y
        elif not has and start is not None:
            bands.append((start, y)); start = None
    if start is not None:
        bands.append((start, h))
    if len(bands) < 2:
        return im
    top, bot = bands[-2], bands[-1]
    band_h = bot[1] - bot[0]
    gap = bot[0] - top[1]
    if band_h < h * 0.18 and gap > h * 0.01:
        return im.crop((0, 0, w, top[1]))
    return im


emblem = emblem_only(img)
if emblem.size != img.size:
    print(f"الرمز وحده للأيقونات: {emblem.width}x{emblem.height} (قُصّ سطر الكلمة)")
else:
    print("لم يُعثر على سطر كلمةٍ منفصل — الأيقونة بالشعار كاملًا")
# وتُقصّ حواف الرمز من جديد، فقصُّ السطر يترك بياضًا أسفله.
g2 = emblem.convert("L").point(lambda v: 255 if v < 245 else 0)
b2 = g2.getbbox()
if b2:
    pad2 = int(max(emblem.size) * 0.02)
    l2, t2, r2, bb2 = b2
    emblem = emblem.crop((max(0, l2 - pad2), max(0, t2 - pad2),
                          min(emblem.width, r2 + pad2), min(emblem.height, bb2 + pad2)))


def square(size, inset_ratio, out_name, bg):
    """
    ⚠️ الأيقونة **مربّعة دائمًا**: أندرويد يقصّ الأيقونة دائرةً، وشعارٌ يملأ
    المربّع تُقطع أطرافه. و`inset` يترك هامشًا آمنًا.
    ⚠️ وmaskable يحتاج هامشًا أكبر (المنطقة الآمنة 80% من الضلع فقط).
    ⚠️ ولا شفافية: الشعار ذهبيّ فاتح، فعلى خلفية شفافة يظهر على سطحٍ غامق
    فيكاد يختفي. فالخلفية صريحة دائمًا.
    """
    canvas = Image.new("RGB", (size, size), bg)
    inner = int(size * inset_ratio)
    logo = emblem.copy()                          # الرمز وحده، لا الشعار كاملًا
    logo.thumbnail((inner, inner), Image.LANCZOS)
    canvas.paste(logo, ((size - logo.width) // 2, (size - logo.height) // 2))
    canvas.save(os.path.join(ICONS, out_name), "PNG", optimize=True)
    print(f"icons/{out_name}  (خلفية {bg})")


# ⚠️⚠️ الشعار واحد للشاشتين — نشاطٌ واحد — لكن **الخلفية تختلف**، وهذا مقصود:
# قرارٌ سابق في هذا المشروع أن لكل تطبيق أيقونةً مميّزة، لأن أربعة تطبيقات
# بأيقونة واحدة أربكت المستخدم فعلًا فلم يعرف أيّها يفتح. وثمّة فحصٌ يمنع
# تطابق أيقونتَي التطبيقين بايتًا ببايت.
# وأول توليد جعلهما متطابقتين فأسقط ذلك الفحص — فبقي الشعار كما هو ولم يُمَسّ،
# واختلفت اللوحة تحته: البياعة على أبيض، وشاشة العرض على لون خلفية بيانها
# (#F5F1E8) وهو لونٌ من هوية العلامة نفسها. فيُميَّزان على الشاشة بلمحة، بلا
# أي تشويه للشعار ولا إضافة رمزٍ دخيل عليه.
ICON_BG = {
    "abaya": "#FFFFFF",        # شاشة البياعة
    "abayaview": "#F5F1E8"     # شاشة العرض — نفس background_color في بيانها
}
for prefix, bg in ICON_BG.items():
    square(192, 0.86, f"{prefix}-192.png", bg)
    square(512, 0.86, f"{prefix}-512.png", bg)
    square(512, 0.66, f"{prefix}-maskable-512.png", bg)   # هامش المنطقة الآمنة
    square(180, 0.86, f"{prefix}-touch.png", bg)          # apple-touch-icon

print("\nتمّ. لا تنسَ رفع رقم CACHE_VERSION في sw.js حتى تُحدَّث الأيقونات المخزَّنة.")
