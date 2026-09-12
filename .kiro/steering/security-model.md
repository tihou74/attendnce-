---
inclusion: fileMatch
fileMatchPattern: ["firestore.rules", "*.html", "**/*.html"]
---

# نموذج الأمان

## نظام الأدوار محذوف — لا تُعِده

نظام (Admin / Accountant / Secretary) **أُزيل نهائيًا بطلب صريح**. لا تُعِد إدخاله ولا تصفه في أي توثيق.

`hasFinanceAccess()` في `admin.html` دالة صورية تُعيد `true` دائمًا، أُبقيت فقط حتى لا تحتاج مواضع استدعائها (حقول الرواتب، تصدير PDF، إنشاء/حذف موظف) إلى تغيير. لا تحذفها ولا تبنِ عليها منطق صلاحيات.

> **تنبيه:** الـ README القديم كان يزعم أن أول من يسجّل الدخول يصبح Accountant وأن Team Access يُعيّن Secretary — نص قديم غير صحيح وقد صُحّح.

## من يملك ماذا

القواعد تعتمد على ثلاث دوال:

| الدالة | التعريف | الصلاحية |
|---|---|---|
| `isSignedIn()` | `request.auth != null` | — |
| `isAdmin()` | مسجَّل **و** `sign_in_provider != 'anonymous'` | أي حساب Email/Password تُنشئه في Firebase Console ← **قراءة وكتابة كاملة** على كل المجموعات |
| `isKiosk()` | مسجَّل **و** `sign_in_provider == 'anonymous'` | `index.html` يسجّل دخولاً مجهولاً عبر `signInAnonymously()` |

**صلاحيات الكيوسك ضيقة ومقصودة:** يُنشئ `attendance` / `leave_requests` / `employee_applications` / `training_acknowledgments`، ويقرأ `employees` / `employee_pins` / `branch_geofences` / `settings` / `attendance` / `training_content` / `training_acknowledgments` — ولا يُعدّل ولا يحذف شيئًا أبدًا، ولا يقرأ `leave_requests` أو `employee_applications` (حتى لا يتصفّح متقدّم صور بطاقات الآخرين).

## سجلات دائمة غير قابلة للتلاعب

`audit_log` و `training_acknowledgments` كلاهما `allow update, delete: if false`. **لا تسمح بالتعديل أو الحذف عليهما مهما كان السبب.**

## PIN

`verifyPin()` يقرأ `employee_pins/{empId}` ويقارن مقارنة تامة. **لا يوجد بديل «1234 يعمل إن كان المستند مفقودًا»** — كان بابًا خلفيًا عامًا وأُزيل. لا تُعِده.

قفل المحاولات: 5 محاولات / 5 دقائق في `localStorage` — أي حماية على مستوى المتصفح فقط. الحماية الحقيقية هي القواعد + **App Check**.

## الرفض الافتراضي

```
match /{document=**} { allow read, write: if false; }
```
أي مجموعة جديدة **لن تعمل** حتى تُضاف قاعدة صريحة لها، وتُنشر من Firebase Console.

القواعد الحالية بالكامل:

#[[file:firestore.rules]]
