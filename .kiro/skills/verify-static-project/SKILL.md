---
name: verify-static-project
description: Verify the Al Sheikha attendance HTML/JS project before pushing — syntax-check inline scripts, validate training content documents, check HTML tag balance and element id references. Use before any commit or push, or whenever asked to confirm nothing is broken.
---

# التحقق قبل الرفع

مشروع بلا أداة بناء ولا `node_modules` ولا مُنسّق — لا يوجد ما يمسك الأخطاء نيابة عنك. نفّذ هذه الفحوصات، **واذكر للمالك أيها نُفِّذ فعليًا وأيها لم يُنفَّذ**.

## ⚠️ فخ لازم: `node` ليس في `PATH`

`node` موجود لكنه **ليس** في `PATH` الافتراضي لجلسة الطرفية. مساره:

```
/root/.nvm/versions/node/v24.19.0/bin/node
```

`node --check` المجرّد يفشل بصمت بـ `command not found`، **وإن رُبط بـ `&&` بعد أمر أنبوبي فقد يُبلِّغ الشل عن نجاح فيطبع `OK` كاذبة**. حدث هذا فعلاً وتطلّب تصحيحًا أمام المالك.

ابدأ كل جلسة تحقق بـ:

```bash
export PATH="$PATH:/root/.nvm/versions/node/v24.19.0/bin"
```

وتحقّق من `which node` قبل الاعتماد على أي نتيجة. **لا تُبلِّغ عن نجاح فحص دون أن ترى مخرجاته الحقيقية.**

## 1) تدقيق ملفات المحتوى وسجلها

```bash
node .kiro/skills/verify-static-project/scripts/validate-training-content.js
```

يفحص: صحة الصياغة لكل ملف، عدم تكرار معرّفات المستندات، وجود `heading` و `text` لكل قسم، وجود الفاصل `———————————————`، وجود سطر فارغ واحد على الأقل (`/\n{2,}/`)، وحجم كل مستند مقابل 900KB. ويؤكد تطابق نسختَي البراندين في الأدلة المشتركة، وخلوّ النص من فراغات اسم براند مثل `في ،`.

يُخرج رمز خروج غير صفري عند أي فشل.

## 2) فحص ملفات HTML

```bash
python3 .kiro/skills/verify-static-project/scripts/check-html.py index.html admin.html import-training.html import-training-standalone.html
```

يستخرج كل كتلة `<script>` مضمّنة ويفحص صياغتها، ويتحقق من توازن الوسوم، ويقابل كل `getElementById('x')` بوجود `id="x"` في الترميز.

> **فخ في الفحص نفسه:** ترشيح كتل السكربت بـ `(?![^>]*\bsrc=)` **يطابق خطأً** نص `<script src>` المكتوب حرفيًا داخل تعليق HTML، فيُنتج فشلاً وهميًا. حدث هذا فعلاً. تجنّب كتابة وسوم script حرفية داخل التعليقات.
>
> ملاحظة: معرّفات مبنية بقوالب نصية مثل `` `rowStatus${i}` `` تُنشأ في وقت التشغيل ولن تظهر في الترميز الساكن — ليست أخطاء.

## 3) محاكاة تشغيل النسخة المستقلة

بعد إعادة توليد `import-training-standalone.html`، أثبِت أنها فعلاً تبني المستندات:

```bash
python3 -c "
import re
src = open('import-training-standalone.html', encoding='utf-8').read()
blocks = re.findall(r'<script(?![^>]*\bsrc=|[^>]*type=\"module\")[^>]*>(.*?)</script>', src, re.S)
open('/tmp/combined.js','w',encoding='utf-8').write('\n'.join(blocks))
print('كتل classic:', len(blocks))
"
node -e "
global.window={};
require('/tmp/combined.js');
const r = global.window.TRAINING_CONTENT_REGISTRY || [];
console.log('المستندات المسجّلة:', r.length);
if (r.length === 0) { console.error('!! فشل: لم يُسجَّل أي مستند'); process.exit(1); }
"
```

يجب أن يكون العدد مساويًا لعدد المستندات المتوقّع، وأن يكون عدد وسوم `script src` المتبقية **صفرًا** (شرط عملها بالنقر المزدوج).

## 4) بعد الرفع — تحقّق من الرابط فعليًا

لا تفترض نجاح `git push`. اجلب رابط raw وتأكّد أن الملف حيّ وأن العربية تظهر سليمة:

```
https://raw.githubusercontent.com/tihou74/attendnce-/main/<path>
```

## ما لا يمكن التحقق منه في البيئة

- الكتابة الفعلية على Firestore (تحتاج بيانات دخول المالك الحقيقية).
- سلوك المتصفح الحقيقي: GPS، صلاحية الموقع، عرض RTL، عمل `file://`.

**صرّح بهذه صراحةً** ولا تدرجها ضمن ما «تم التحقق منه».
