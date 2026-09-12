---
name: add-training-department
description: Add or update a bilingual (Arabic/English) training guide for a restaurant department in the Al Sheikha attendance system. Use when the owner sends training content for a department such as hospitality, cashier, barista, cleaner, hot kitchen or pastry, or when an existing guide needs editing.
---

# إضافة دليل تدريب لقسم

## 1) اسأل أولاً: مشترك أم لا؟

اقرأ ترويسة المستند الذي أرسله المالك:

- ذكر **البراندين** («شاي بوحمد وقيمر وكاهي») ← الدليل **مشترك** ← ولّد مستندين.
- ذكر براندًا واحدًا ← مستند واحد.

إن كان غامضًا، اسأل سؤالاً واحدًا قصيرًا. لا تخمّن — هذا قرار بنيوي.

## 2) معرّف المستند

```js
`${restaurant}__${department}`.replace(/\s+/g, '_')
```

- المطاعم: `"GAIMER W KAHI"` · `"SHAI BU HAMAD"`
- الأقسام: `CASHIER` · `BARISTA` · `CLEANER` · `HOSPITALITY` · `HOT_KITCHEN` · `PASTRY`
- مثال الناتج: `GAIMER_W_KAHI__HOSPITALITY`

> ⚠️ هذه الدالة **مكرّرة في ثلاثة ملفات**: `index.html` و `admin.html` و `import-training.html`. أي تغيير في صيغتها يجب أن يحدث في الثلاثة، وإلا قرأ الكيوسك مستندًا مختلفًا عن الذي يكتبه المحرر.

## 3) أنشئ ملف المحتوى

المسار: `training-content/<اسم-وصفي>.js`

```js
(function () {
    "use strict";
    window.TRAINING_CONTENT_REGISTRY = window.TRAINING_CONTENT_REGISTRY || [];
    var SEP = "———————————————";

    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "GAIMER W KAHI",
        department: "HOSPITALITY",
        sourceFile: "training-content/<اسم-الملف>.js",
        sections: [
            {
                heading: "العنوان العربي — English Heading",
                text: `النص العربي، فقرة أولى.

فقرة عربية ثانية.

${SEP}

The English text, first paragraph.

Second English paragraph.`
            }
        ]
    });
})();
```

### قواعد صياغة النص — غير قابلة للتفاوض

1. **العربية في الأعلى، الإنجليزية تحتها**، يفصلهما سطر من 15 شرطة `———————————————` مع **سطر فارغ قبله وبعده**.
2. **لا وسوم HTML داخل `text`** — الكيوسك يمرّره عبر `escapeHtml`، فستظهر الوسوم كنص حرفي.
3. **الأسطر الفارغة بنيوية:** الكيوسك يقسّم على `/\n{2,}/` ويلفّ كل كتلة في `<p dir="auto" style="text-align: start">`، وهذا ما يجعل العربية RTL والإنجليزية LTR داخل القسم نفسه. **أي إسقاط للسطر الفارغ يكسر الاتجاه.**
4. اجعل كل قسم موضوعًا واحدًا مفهومًا؛ قسّم الجداول الطويلة إلى أقسام (قراءة أفضل على الهاتف).

### نمط الدليل المشترك

اختر أحد النمطين الموجودين:

- **يوجد اسم براند منطوق داخل النص** (كالكاشير: عبارات ترحيب وهاتف) ← دالة
  `buildSections(brandAr, brandEn)` تُستدعى مرتين، فيُستبدل الاسم لكل براند.
  راجع `training-content/cashier-shared.js`.
- **لا اسم براند داخل النص** (كالنظافة: بروتوكولات MoPH/HACCP) ← ثابت واحد
  `CLEANER_SECTIONS` يُدفع مرتين كما هو.
  راجع `training-content/gaimer-w-kahi-cleaner.js`.

الغاية من كليهما: منع انحراف نسختَي البراندين عند أي تعديل مستقبلي.

### الأمانة تجاه المصدر

إن كان المستند المُرسل ناقصًا أو متناقضًا (ترقيم يقفز، خانات فارغة، اسم براند مضطرب) — **وثّق ذلك في تعليق رأس الملف ولا تخترع محتوى**. ثم أبلغ المالك.

## 4) اربطه بأداة الاستيراد

أضف وسم `script` واحدًا في `import-training.html` (الأداة تكتشفه تلقائيًا):

```html
<script src="training-content/<اسم-الملف>.js"></script>
```

## 5) أعد توليد النسخة المستقلة

المالك يستخدم `import-training-standalone.html` (تعمل بالنقر المزدوج). **يجب إعادة توليدها** بعد أي تغيير في المحتوى — انظر مهارة `regenerate-standalone-importer`.

## 6) تحقّق ثم ارفع

نفّذ مهارة `verify-static-project` كاملة قبل الرفع. ثم ارفع إلى `tihou74/attendnce-` فرع `main`، وسلّم للمالك **روابط raw** (انظر `working-with-the-owner.md`).

## حالة المحتوى

| المستند | الأقسام | الملف |
|---|---|---|
| `GAIMER_W_KAHI__HOSPITALITY` | 29 | `gaimer-w-kahi-hospitality.js` |
| `GAIMER_W_KAHI__CASHIER` | 13 | `cashier-shared.js` |
| `SHAI_BU_HAMAD__CASHIER` | 13 | `cashier-shared.js` |
| `GAIMER_W_KAHI__BARISTA` | 11 | `gaimer-w-kahi-barista.js` |
| `GAIMER_W_KAHI__CLEANER` | 13 | `gaimer-w-kahi-cleaner.js` |
| `SHAI_BU_HAMAD__CLEANER` | 13 | `gaimer-w-kahi-cleaner.js` |

**المتبقي:** `HOT_KITCHEN` · `PASTRY` · وأي أقسام أخرى لشاي بوحمد.

## حد الحجم

سقف Firestore 1MB لكل مستند، والصور تُخزَّن base64 **داخل** المستند. الحدّ العملي المفروض في الكود 900KB. أكبر مستند حاليًا 35.9KB، فالنصوص مريحة جدًا — لكن الصور تستهلك بسرعة، فانصح بضغطها تحت 150KB.
