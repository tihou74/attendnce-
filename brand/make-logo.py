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

# ---- 4) الأيقونات: مربّعة، والشعار في وسطها -------------------------------
def square(size, inset_ratio, out_name):
    """
    ⚠️ الأيقونة **مربّعة دائمًا** وبخلفية بيضاء: أندرويد يقصّ الأيقونة دائرةً،
    وشعارٌ يملأ المربّع تُقطع أطرافه. و`inset` يترك هامشًا آمنًا.
    ⚠️ وmaskable يحتاج هامشًا أكبر (المنطقة الآمنة 80% من الضلع فقط).
    """
    canvas = Image.new("RGB", (size, size), "#FFFFFF")
    inner = int(size * inset_ratio)
    logo = img.copy()
    logo.thumbnail((inner, inner), Image.LANCZOS)
    canvas.paste(logo, ((size - logo.width) // 2, (size - logo.height) // 2))
    canvas.save(os.path.join(ICONS, out_name), "PNG", optimize=True)
    print("icons/" + out_name)

# نفس الشعار لأيقونتي الشاشتين: نشاطٌ واحد، فلا معنى لأن تختلف صورتاهما.
for prefix in ("abaya", "abayaview"):
    square(192, 0.86, f"{prefix}-192.png")
    square(512, 0.86, f"{prefix}-512.png")
    square(512, 0.66, f"{prefix}-maskable-512.png")   # هامش المنطقة الآمنة
    square(180, 0.86, f"{prefix}-touch.png")          # apple-touch-icon

print("\nتمّ. لا تنسَ رفع رقم CACHE_VERSION في sw.js حتى تُحدَّث الأيقونات المخزَّنة.")
