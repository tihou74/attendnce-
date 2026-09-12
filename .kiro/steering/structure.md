---
inclusion: always
---

# بنية المشروع والمستودعات

## الملفات

```
attendnce-/
├── index.html                          كيوسك الموظفين + شاشة التقرير المخفية
├── admin.html                          لوحة الإدارة، 12 تبويبًا
├── report.html                         نقطة دخول المديرين + تثبيت تطبيقهم
├── firestore.rules                     قواعد الأمان — مكانها Firebase Console
├── manifest.json                       تطبيق الموظفين (PWA)
├── manifest-report.json                تطبيق المديرين  (start_url = index.html#report)
├── manifest-admin.json                 تطبيق لوحة الإدارة
├── sw.js                               Service Worker — الشبكة أولًا لـ HTML
├── icons/                              أيقونات التطبيق (مُولَّدة، انظر المهارة)
├── import-training.html                أداة الاستيراد (تحتاج خادمًا)
├── import-training-standalone.html     نسخة مستقلة مُولَّدة — تعمل بالنقر المزدوج
├── training-content/                   مصدر محتوى التدريب
│   ├── gaimer-w-kahi-hospitality.js
│   ├── cashier-shared.js               يولّد مستندين (البراندان)
│   ├── gaimer-w-kahi-barista.js
│   └── gaimer-w-kahi-cleaner.js        يولّد مستندين (البراندان)
└── README.md
```

## الاستضافة والروابط

الموقع منشور على **GitHub Pages** من فرع `main` مجلد `/` — أي تعديل يُرفع يظهر تلقائيًا خلال دقيقة، ولم يبقَ نسخ يدوي للملفات.

| الواجهة | الرابط |
|---|---|
| الموظفون | `https://tihou74.github.io/attendnce-/index.html` |
| المديرون | `https://tihou74.github.io/attendnce-/report.html` |
| الإدارة | `https://tihou74.github.io/attendnce-/admin.html` |

## قاعدة حاكمة في `sw.js`

ملفات HTML تُجلب **من الشبكة أولًا** دائمًا، والكاش احتياطي عند انقطاع الشبكة فقط. **لا تحوّلها إلى «الكاش أولًا»** — سيرى المستخدمون نسخة قديمة من التطبيق بعد كل تحديث، وهو ما يُبطل ميزة التحديث التلقائي.

وكل طلب إلى نطاقات Firebase يُترك للشبكة **بلا اعتراض** (`BYPASS_HOSTS`): اعتراضه يفسد الاتصال المستمر الذي يستخدمه Firestore وقد يُخزّن ردود مصادقة.

`import-training-standalone.html` **مُولَّد تلقائيًا — لا تعدّله يدويًا.** عدّل `training-content/*.js` ثم أعد توليده (انظر مهارة `regenerate-standalone-importer`).

## المستودعات والصلاحيات

| المستودع | الفرع | الصلاحية | الدور |
|---|---|---|---|
| `tihou74/attendnce-` | `main` | ✅ كتابة | **المستودع الأساسي** — كل العمل هنا |
| `tihou74/alsheikha-attendance-admin` | `main` | ✅ كتابة | يستضيف الشعارات والصور التي تستدعيها الصفحات عبر روابط raw ثابتة — **لا تحذف أو تعدّل ملفات .png/.jpeg فيه** |
| `sheikhastyleboutique3-glitch/erp` | `alsheikha-attendance-files` | ❌ قراءة فقط | نسخة تاريخية. `git push` يفشل بـ 403، و`fork` يفشل بـ 403 أيضًا. مجلد `alsheikha-attendance/` غير موجود في `main` والفرع يسبقه بـ 22+ commit، فأي PR إلى `main` سيكون ضخمًا |

إن أراد المالك روابط على مسار `sheikhastyleboutique3-glitch/erp`، الحل الوحيد أن يضيف `tihou74` كـ collaborator هناك.

## الصور

`index.html` و `admin.html` يستدعيان الشعارات وصور الخلفية عبر روابط raw مثبتة إلى `tihou74/alsheikha-attendance-admin`. لذلك **لا حاجة لنسخ الصور** عند نشر المشروع في أي مكان.
