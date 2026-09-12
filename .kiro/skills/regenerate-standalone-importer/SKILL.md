---
name: regenerate-standalone-importer
description: Regenerate import-training-standalone.html, the single self-contained file that uploads all training content to Firestore without needing a local web server. Use after adding or editing any training-content file, since the standalone copy would otherwise be stale.
---

# إعادة توليد أداة الاستيراد المستقلة

## لماذا توجد هذه النسخة

`import-training.html` تستدعي ملفات المحتوى عبر `<script src="training-content/...">`. المتصفح **يمنع** ذلك عند فتح الملف بالنقر المزدوج من القرص (`file://`)، فتحتاج خادمًا محليًا.

**مالك المشروع لا يستخدم سطر الأوامر** ولم يستطع تشغيل خادم (انظر `working-with-the-owner.md`). لذلك وُلدت `import-training-standalone.html`: نسخة تُضمِّن كل ملفات المحتوى **داخل الصفحة نفسها**، فلا تستدعي أي ملف خارجي وتعمل بالنقر المزدوج مباشرة.

## ⚠️ قاعدة حاكمة

`import-training-standalone.html` **ملف مُولَّد. لا تعدّله يدويًا أبدًا.**
عدّل `training-content/*.js` ثم أعد التوليد، وإلا ضاع تعديلك في المرة القادمة.

**وأعد توليده بعد كل تغيير في المحتوى** — وإلا رفع المالك نسخة قديمة دون أن يدري.

## التوليد

```bash
python3 .kiro/skills/regenerate-standalone-importer/scripts/build-standalone.py
```

ما يفعله السكربت:

1. يقرأ `import-training.html` كأصل.
2. يتحقّق أن أي ملف محتوى **لا يحتوي** النص `</script>` حرفيًا (وإلا كسر التضمين المباشر) — يتوقف بخطأ إن وجده.
3. يستبدل كل وسم `<script src="training-content/...">` بمحتوى الملف مضمّنًا بين `<script>` و `</script>`.
4. يعدّل التعليقات والتعليمات داخل الصفحة لتوضّح أنها نسخة مستقلة لا تحتاج خادمًا.
5. يكتب `import-training-standalone.html` ويؤكّد أن عدد وسوم `script src` المتبقية **صفر**.

## التحقق بعد التوليد — إلزامي

لا تكتفِ بنجاح السكربت. أثبِت أن الملف فعلاً يبني المستندات:

```bash
export PATH="$PATH:/root/.nvm/versions/node/v24.19.0/bin"
python3 .kiro/skills/verify-static-project/scripts/check-html.py import-training-standalone.html
```

ثم محاكاة التشغيل الحقيقي (الخطوة 3 في مهارة `verify-static-project`): تجميع كتل `script` غير الوحدات وتنفيذها على `window` وهمي، والتأكد من تسجيل العدد الصحيح من المستندات.

المتوقّع حاليًا: **6 مستندات، 92 قسمًا**، وحجم الملف نحو 127KB.

## تسليمه للمالك

سلّمه رابط raw واحدًا فقط:

```
https://raw.githubusercontent.com/tihou74/attendnce-/main/import-training-standalone.html
```

وذكّره بالخطوات: انسخ ← احفظ بـ **All Files** و **UTF-8** ← نقرة مزدوجة ← سجّل الدخول بحساب الإدارة ← «معاينة» للتأكد ← «رفع كل المحتوى».
