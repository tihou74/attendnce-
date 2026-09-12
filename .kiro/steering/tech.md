---
inclusion: always
---

# التقنية

## مبدأ أساسي: صفر خطوات بناء

المشروع **صفحات HTML مستقلة** تعمل مباشرة في المتصفح. لا npm، لا bundler، لا خادم خلفي، لا `node_modules`.
**لا تُدخل أي أداة بناء أو مدير حزم إلى هذا المشروع.**

- **Firebase Modular SDK v10.8.0** تُستورد مباشرة من `https://www.gstatic.com/firebasejs/10.8.0/` داخل `<script type="module">`.
- مشروع Firebase: `attendance-system-f32d6` (الإعدادات مضمّنة في كل صفحة — يُنصح بتفعيل **App Check**).
- مكتبات إضافية في `admin.html` عبر CDN: html2canvas 1.4.1، jspdf 2.5.1، xlsx 0.18.5.

## مجموعات Firestore

`employees` · `employee_pins` · `attendance` · `deductions` · `leave_requests` · `employee_applications` · `employee_warnings` · `annual_leaves` · `allowance_payments` · `audit_log` · `branch_geofences` · `settings` · `training_content` · `training_acknowledgments` · `admin_users` (قديمة وغير مستخدمة)

## قيود يجب احترامها

### لا يوجد Storage bucket
كل ملف مرفوع (صور البطاقة، العقود، الشهادات الصحية، صور أقسام التدريب) يُخزَّن **داخل مستند Firestore نفسه** كـ base64 data URL.

- حد Firestore الصلب: **1,048,576 بايت لكل مستند**.
- `MAX_DOC_FILE_BYTES = 700 * 1024` لكل ملف مرفوع.
- `TRAINING_DOC_SAFE_LIMIT_BYTES = 900 * 1024` لكل مستند تدريب، مع رفض الحفظ برسالة واضحة قبل الوصول للحد.
- انصح دائمًا بضغط الصور إلى أقل من 150KB.

### الفهارس المركّبة
استعلامات `attendance` بـ (`employeeId` + `timestamp`) و (`employeeId` + `type` + `timestamp`) تحتاج فهارس مركّبة.
الكود يحتوي `try/catch` مع بديل يمسح السجلات بلا ترتيب عند غياب الفهرس — **حافظ على هذا البديل** ولا تحذفه.

### إقران الحضور يحدث في المتصفح
`buildSessions(logs)` في `admin.html` يجمع بـ `` `${employeeId}|${date}` ``، يرتّب حسب الوقت، يقرن كل دخول بأقرب انصراف غير مستخدَم بعده (يدعم أكثر من جلسة في اليوم)، ويُخرج أي انصراف بلا دخول كسطر مستقل.

## أنماط برمجية متبعة

- **سجل التدقيق نار وانسَ:** `logAudit(action, details)` لا يُنتظر أبدًا ولا يرمي خطأً إلى العملية الأصلية.
- **الهروب من HTML إلزامي:** كل إدخال مستخدم يمرّ عبر `escapeHtml()` أو `escapeJsAttr()` قبل الإدراج في DOM.
- **حماية العناصر المفقودة:** استخدم `setIconIfPresent(id, name)` بدل `getElementById(...).innerHTML` المباشر، فعنصر مفقود واحد كان يوقف السكربت كله ويمنع تسجيل الدخول.
- **الدوال العامة على `window`** مع `onclick` مضمّن في HTML — تغيير اسم دالة يكسر أزرارًا بصمت.
