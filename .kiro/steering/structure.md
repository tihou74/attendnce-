---
inclusion: always
---

# بنية المشروع والمستودعات

## الملفات

```
attendnce-/
├── index.html                          كيوسك الموظفين (~1500 سطر)
├── admin.html                          لوحة الإدارة، 11 تبويبًا (~4050 سطر)
├── firestore.rules                     قواعد الأمان — مكانها Firebase Console
├── import-training.html                أداة الاستيراد (تحتاج خادمًا)
├── import-training-standalone.html     نسخة مستقلة مُولَّدة — تعمل بالنقر المزدوج
├── training-content/                   مصدر محتوى التدريب
│   ├── gaimer-w-kahi-hospitality.js
│   ├── cashier-shared.js               يولّد مستندين (البراندان)
│   ├── gaimer-w-kahi-barista.js
│   └── gaimer-w-kahi-cleaner.js        يولّد مستندين (البراندان)
└── README.md
```

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
