---
inclusion: fileMatch
fileMatchPattern: ["admin.html"]
---

# قواعد الرواتب — سياسة إدارية لا تُبسَّط

هذه الأرقام والمعادلات **سياسة معتمدة من الإدارة**، وليست خيارات هندسية. لا تعدّلها ولا «تحسّنها» دون طلب صريح، وموضعها كله في `computePayroll(emp, startDate, endDate)` داخل `admin.html`.

## الراتب الأساسي والبدلات

- `BASIC_SALARY_QAR = 1000` — **ثابت لكل موظف بلا استثناء**.
- `emp.salary` المخزَّن هو **الراتب الإجمالي** (الحزمة الكاملة).
- `otherAllowances = max(0, totalSalary - 1000)`.

## العمل الإضافي

يُحسب على **الأساسي فقط** (قانون العمل القطري رقم 14/2004 مادة 74).

- `OT_DAY_MULTIPLIER = 1.25` · `OT_NIGHT_MULTIPLIER = 1.5`
- نافذة الليل: `NIGHT_START_HOUR = 21` إلى `NIGHT_END_HOUR = 6`
- `nightMinutesBetween()` يمشي يومًا بيوم فتبقى الجلسات العابرة لمنتصف الليل صحيحة، ودقائق الإضافي لكل يوم تُقسَّم نهار/ليل بنسبة الليل الفعلية لذلك اليوم.

### شرط التحفيز يومي، وليس شهريًا

- `STANDARD_DAILY_HOURS = 10` · `DAILY_OT_GRACE_HOURS = 2`
- اليوم **لا يولّد أي إضافي** إلا إذا تجاوز الزائد عن 10 ساعات **أكثر من** ساعتي السماح، أي أن مجموع اليوم يجب أن يتجاوز **12 ساعة**.
- عند تجاوز العتبة، يُحسب **كل** الزائد عن 10 ساعات إضافيًا — لا الجزء بعد السماح فقط.
- يوم من 11.5 ساعة يُدفع يومًا عاديًا بصفر إضافي.

### سعر الساعة

```
STANDARD_MONTHLY_HOURS = 30 * (6/7) * 10 ≈ 257.14
basicHourlyRate = 1000 / STANDARD_MONTHLY_HOURS
```
رقم **ثابت** لشهر 28 أو 29 أو 30 أو 31 يومًا على السواء. يؤثر فقط في قيمة ساعة الإضافي بالريال، ولا يؤثر إطلاقًا في تحفيز الإضافي.

## أيام الراحة المكتسبة

`WORK_DAYS_PER_EARNED_OFF_DAY = 6` — يوم راحة مدفوع لكل 6 أيام عمل فعلية، غير مرتبط بيوم أسبوع معيّن، وبلا تناسب مع طول الشهر.

```
earnedRestDays = floor(workedDays / 6)
variance       = restDays - earnedRestDays
variance > 0 → absentDays  ← تُخصم بـ dailyRate
variance < 0 → extraWorkedDays ← تُدفع مكافأة بـ basicHourlyRate * 10 * 1.25
```

الأيام المشمولة بإجازة سنوية معتمدة أو بخصم يدوي **تُستثنى تمامًا** من هذه المعادلة (منعًا للاحتساب المزدوج). حضور صفر يعني رصيد راحة صفر، فيصبح كل يوم غير مشتغل غيابًا وينهار الصافي نحو 0.

## الخصومات — ثلاث سِلال لا تتقاطع

كلها مستندات **مؤرَّخة** في `deductions` فتؤثر فقط في الفترة التي يقع تاريخها فيها:

| النوع | الحقل | الدالة |
|---|---|---|
| بالأيام | `type: 'days'` | `deductionsInRange()` |
| مبلغ مباشر | `type: 'amount'` | `deductionsInRange()` |
| مبالغ أخرى | `isOtherAmount: true` | `otherAmountDeductedInRange()` |

مستندات `isOtherAmount` **مستثناة عمدًا** من `deductionsInRange()` حتى لا تُحتسب مرتين، وتُدار بـ `findOtherAmountDoc()` / `saveOtherAmountDeducted()` (إدخال 0 يحذف المستند بدل تركه صفرًا معلّقًا).

- `dailyRate = totalSalary / daysInMonth(startDate)`

## الوردية تتبع شهر بدايتها

قرار إداري: الوردية تُحتسب **بالكامل** في الشهر الذي بدأت فيه. وردية تبدأ 31 أكتوبر 22:00 وتنتهي 1 نوفمبر 06:00 تُحتسب كلها في أكتوبر.

يُنفَّذ عبر `sessionsInRange(logs, startDate, endDate)` وهي **المصدر الوحيد** لترشيح الحضور بالتاريخ (الرواتب، سجلات الحضور، التقرير الشهري، تصدير Excel). تُبنى الجلسات من تاريخ الموظف الكامل ثم تُرشَّح بـ `s.date` وهو تاريخ **الدخول**.

⚠️ **لا تُرشِّح السجلات الخام بالتاريخ قبل استدعائها** — `workMinutes` مخزَّنة على مستند الانصراف، فالترشيح المسبق يقطع انصراف وردية بدأت آخر يوم في الفترة وينقل ساعاتها إلى الشهر التالي. ترشيح الفرع على السجلات الخام مقبول؛ التاريخ على الجلسات فقط.
- `HOUSING_DEDUCTION_QAR = 50` ثابت لكل فترة عند `emp.housingType === 'company'`، و`'external'` لا خصم.

## الإجازة السنوية

`ANNUAL_LEAVE_DAYS_PER_YEAR = 21` · `ANNUAL_LEAVE_ALLOWANCE_QAR = 750` · `ANNUAL_TICKET_ALLOWANCE_QAR = 750` · `LEAVE_ELIGIBILITY_MONTHS = 12`

`saveAnnualLeave()` ينشئ 4 مستندات مترابطة: بدلَي إجازة وتذكرة في `allowance_payments`، وخصمًا في `deductions`، ومستند `annual_leaves` يحمل `linkedAllowanceId` و `linkedTicketAllowanceId` و `linkedDeductionId` — **حافظ على هذا الترابط** فهو ما يجعل الحذف ينظّف كل التوابع.

## الصافي

```
netSalary = totalSalary + otAmount + allowancesPaidThisPeriod + extraWorkedAmount
          - totalDeductionAmount - autoAbsenceAmount
          - housingDeductionAmount - otherAmountDeducted
```
ويُحدّ بـ 0 كأدنى قيمة.

## إخفاء الأسعار حسب الدور

لا ينطبق على هذا المشروع (لا يوجد فيه أسعار منتجات). لكن إن أُضيفت لاحقًا، القاعدة في مشاريع المجموعة: المطبخ والحلويات والباريستا والتنظيف والمستودع والسائق **لا يرون أي أسعار**.
