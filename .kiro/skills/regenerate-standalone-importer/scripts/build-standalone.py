#!/usr/bin/env python3
"""
يولّد import-training-standalone.html من import-training.html بتضمين كل ملفات
المحتوى داخل الصفحة، فتعمل بالنقر المزدوج من القرص (file://) بدون خادم.

Generates the self-contained standalone importer.

التشغيل / Usage:
    python3 .kiro/skills/regenerate-standalone-importer/scripts/build-standalone.py

يُنفَّذ من جذر المستودع. رمز الخروج 0 = نجح، 1 = فشل.
"""

import os
import re
import sys

SOURCE = "import-training.html"
TARGET = "import-training-standalone.html"

SRC_TAG_RE = r'<script src="(training-content/[^"]+)"></script>'


def main():
    if not os.path.exists(SOURCE):
        print(f"!! {SOURCE} غير موجود — نفّذ السكربت من جذر المستودع")
        return 1

    src = open(SOURCE, encoding="utf-8").read()

    files = re.findall(SRC_TAG_RE, src)
    if not files:
        print(f"!! لم يُعثر على أي وسم script لملفات training-content في {SOURCE}")
        return 1
    print(f"ملفات المحتوى المكتشفة: {len(files)}")

    # تحقّق أن أي ملف لا يحتوي "</script>" حرفيًا — سيكسر التضمين المباشر.
    unsafe = []
    for path in files:
        if not os.path.exists(path):
            print(f"!! ملف مفقود: {path}")
            return 1
        body = open(path, encoding="utf-8").read()
        if "</script" in body.lower():
            unsafe.append(path)

    if unsafe:
        print(f"!! ملفات تحتوي </script> ولا يمكن تضمينها مباشرة: {unsafe}")
        print("   الحل: تقسيم النص أو ترميز الوسم قبل التضمين.")
        return 1
    print("فحص </script>: آمن")

    def inline(match):
        path = match.group(1)
        body = open(path, encoding="utf-8").read()
        return f"<!-- ==== محتوى مضمّن من {path} ==== -->\n<script>\n{body}\n</script>"

    out = re.sub(SRC_TAG_RE, inline, src)

    # تعديل التعليقات والتعليمات لتوضّح أنها نسخة مستقلة.
    replacements = [
        (
            "window.TRAINING_CONTENT_REGISTRY عبر وسم script عادي بالأسفل — لا\n"
            "          نستخدم fetch لملفات JSON محلية حتى تعمل هذه الصفحة حتى لو فُتحت\n"
            "          مباشرة من القرص (file://) بدون أي سيرفر، ودون مشاكل CORS / MIME.",
            "window.TRAINING_CONTENT_REGISTRY. في هذه النسخة المستقلة كل المحتوى\n"
            "          مضمّن داخل هذا الملف نفسه، فلا يستدعي أي ملف خارجي إطلاقًا — لذلك\n"
            "          يعمل بالنقر المزدوج مباشرة من القرص (file://) بدون أي خادم.",
        ),
        (
            "لإضافة قسم/مطعم جديد: أضف ملف .js جديد في training-content/ ثم أضف له\n"
            "     وسم script بمسار الملف في قائمة السكربتات بالأسفل. لا شيء آخر مطلوب.",
            "تنبيه: هذه نسخة مستقلة مُولَّدة تلقائيًا. لا تعدّلها يدويًا — عدّل ملفات\n"
            "     training-content/*.js ثم أعد توليد هذه النسخة، وإلا ضاع تعديلك.",
        ),
        (
            "<title>استيراد محتوى التدريب — Training Content Importer</title>",
            "<title>استيراد محتوى التدريب (نسخة مستقلة) — Standalone Training Importer</title>",
        ),
        (
            "سجّل الدخول بنفس حساب لوحة الإدارة، ثم راجع المحتوى، ثم اضغط «رفع».",
            "هذه نسخة <b>مستقلة</b>: كل المحتوى مضمّن داخل هذا الملف، فتعمل بالنقر "
            "المزدوج بدون أي خادم.<br>سجّل الدخول بنفس حساب لوحة الإدارة، ثم راجع "
            "المحتوى، ثم اضغط «رفع».",
        ),
    ]

    applied = 0
    for old, new in replacements:
        if old in out:
            out = out.replace(old, new)
            applied += 1
    print(f"تعديلات نصية مطبَّقة: {applied} من {len(replacements)}")
    if applied < len(replacements):
        print("   (تنبيه: تغيّر نص المصدر — راجع الاستبدالات في هذا السكربت)")

    remaining = len(re.findall(r'<script src="training-content', out))
    if remaining:
        print(f"!! ما زالت هناك {remaining} وسوم script خارجية — التضمين لم يكتمل")
        return 1

    open(TARGET, "w", encoding="utf-8").write(out)
    size_kb = os.path.getsize(TARGET) / 1024
    print("")
    print(f"تم التوليد: {TARGET} ({size_kb:.1f} KB)")
    print("وسوم script خارجية متبقية: 0")
    print("")
    print("الخطوة التالية إلزامية — تحقّق فعلي:")
    print("  python3 .kiro/skills/verify-static-project/scripts/check-html.py "
          f"{TARGET}")
    print("  ثم محاكاة التشغيل (الخطوة 3 في مهارة verify-static-project)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
