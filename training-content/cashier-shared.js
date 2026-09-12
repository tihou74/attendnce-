/* =============================================================================
   محتوى التدريب — قسم الكاشير (دليل مشترك للبراندين)
   Training Content — Cashier Department (shared guide for both brands)
   -----------------------------------------------------------------------------
   المصدر: «دليل المعايير والبروتوكول التشغيلي الموحد لقسم الكاشير» — الإصدار V1
   دولة قطر — إدارة المطعم

   لماذا ملف واحد لمطعمين؟
   ------------------------
   رأس المستند الأصلي المُرسل من الإدارة يقول «مطعم شاي بوحمد، وقيمر وكاهي» —
   أي أن هذا الدليل مشترك بين البراندين، والاختلاف الوحيد بينهما هو اسم البراند
   الذي يُنطق في العبارات الترحيبية وعبارات الوداع والهاتف. لذلك يُكتب المحتوى
   مرة واحدة في buildSections() ويُولَّد مستندان منه:
       GAIMER_W_KAHI__CASHIER
       SHAI_BU_HAMAD__CASHIER
   وهذا يمنع انحراف النسختين عن بعضهما مستقبلاً عند أي تعديل.

   ملاحظتان على المستند الأصلي (تحتاج قرار الإدارة):
   1) ترقيم المحاور في الأصل يقفز: 1 ثم 4 ثم 5 ثم 6 ثم 7 — المحوران 2 و 3
      غير موجودين في النص المُرسل. تم الحفاظ على العناوين كما هي بدون اختراع
      محتوى للمحورين الناقصين.
   2) في موضعين كان اسم البراند فارغًا في الأصل («بك في ، معك...» و«تواصلك
      معنا في ، ونتمنى...») — تم إدراج اسم البراند الصحيح تلقائيًا هنا.

   ملاحظات تقنية: انظر تعليقات gaimer-w-kahi-hospitality.js — نفس البنية،
   ونفس قاعدة الأسطر الفارغة التي تحدد اتجاه كل فقرة تلقائيًا في الكيوسك.
   ============================================================================= */

(function () {
    "use strict";

    window.TRAINING_CONTENT_REGISTRY = window.TRAINING_CONTENT_REGISTRY || [];

    var SEP = "———————————————";

    /**
     * يبني أقسام دليل الكاشير لبراند معيّن.
     * @param {string} brandAr اسم البراند بالعربية كما يُنطق للضيف
     * @param {string} brandEn اسم البراند بالإنجليزية
     */
    function buildSections(brandAr, brandEn) {
        return [

            /* ---------------------------------------------------------------
               المقدمة
               --------------------------------------------------------------- */
            {
                heading: "مقدمة الدليل ونطاقه — Guide Introduction and Scope",
                text: `دليل المعايير والبروتوكول التشغيلي الموحد لقسم الكاشير
مطعم ${brandAr} — دولة قطر
رقم الإصدار: V1

هذا الإصدار مُحدّث بالمعايير الشاملة والدقيقة لإدارة الصندوق والإجراءات المالية والبروتوكول الاحترافي.

يهدف هذا الدليل إلى توحيد أسلوب تعامل موظفي الكاشير مع الضيوف والنقدية، وضبط الإجراءات المالية على نظام نقاط البيع، وتحديد قائمة التفقد اليومية الواجب تنفيذها في كل شفت، بما يضمن دقة الحسابات وسرعة الخدمة وحماية أموال المطعم.

مع تحيات إدارة المطعم.

${SEP}

Unified Standards and Operational Protocol Guide for the Cashier Department
${brandEn} Restaurant — State of Qatar
Version: V1

This version has been updated with comprehensive and precise standards for cash-drawer management, financial procedures and professional protocol.

The purpose of this guide is to standardize how cashiers deal with guests and with cash, to control financial procedures on the Point of Sale system, and to define the daily checklist that must be completed on every shift — ensuring accurate accounts, fast service and the protection of the restaurant's money.

With the compliments of the Restaurant Management.`
            },

            /* ---------------------------------------------------------------
               1. بروتوكول التعامل مع الضيوف والنقدية
               --------------------------------------------------------------- */
            {
                heading: "1.1 — الاستقبال والترحيب في منطقة الكاشير / The Cashier Greeting Rule",
                text: `قاعدة التواصل الفوري:
الابتسامة الدافئة والتواصل البصري المباشر خلال 3 ثوانٍ من اقتراب الضيف من منطقة الكاشير.

العبارة الترحيبية المعتمدة:
«يا مرحباً ومسهلا بكم في ${brandAr}، أتمنى أن تكون التجربة قد حازت على رضاكم اليوم».

مراجعة الفاتورة والملاحظات:
التأكد من رقم الطاولة أو رقم الطلب، وسؤال الضيف بلطف عن جودة الطعام والخدمة قبل إتمام الماليّة.

${SEP}

The immediate-contact rule:
A warm smile and direct eye contact within 3 seconds of the guest approaching the cashier area.

The approved welcome phrase:
"You are most welcome to ${brandEn}. I hope your experience today has been to your full satisfaction."

Reviewing the bill and any notes:
Confirm the table number or the order number, and politely ask the guest about the quality of the food and the service before completing the financial transaction.`
            },

            {
                heading: "1.2 — معايير تحصيل الأموال وإتيكيت الدفع / Payment Processing Standards",
                text: `تقديم الفاتورة:
تقديم الفاتورة مطبوعة بوضوح وداخل حافظة الفواتير المخصصة للبراند بشكل غير مكشوف.

خيارات الدفع:
الاستفسار عن طريقة الدفع المفضلة (نقداً، بطاقة ائتمانية/مصرفية، أو تطبيق المحفظة الإلكترونية).

التعامل مع النقود:
• عد النقد المستلم أمام الضيف لتأكيد المبلغ: «المستلم 200 ريال قطري».
• إرجاع الباقي بدقة مع الفاتورة والوصل باليد اليمنى مع قول: «تفضل الباقي والفاتورة، شاكرين لك».

الدفع بالبطاقات:
التأكد من إدخال المبلغ الصحيح على جهاز نقاط البيع، وتناول البطاقة وتسليمها بحرص مع إيصال عملية الدفع.

${SEP}

Presenting the bill:
Present the bill clearly printed and inside the brand's dedicated bill folder, never exposed openly.

Payment options:
Ask about the guest's preferred payment method (cash, credit/debit card, or e-wallet application).

Cash handling:
• Count the cash received in front of the guest to confirm the amount: "Two hundred Qatari Riyals received."
• Return the change accurately, together with the bill and the receipt, using the right hand, while saying: "Here is your change and your bill. Thank you."

Card transactions:
Make sure the correct amount is entered on the POS terminal, and take and return the card carefully together with the payment receipt.`
            },

            {
                heading: "1.3 — إنهاء المعاملة والوداع / Closing the Transaction and Farewell",
                text: `عبارة المغادرة المعتمدة:
«أسعدتونا بحضوركم، ونشوفكم على خير قريب إن شاء الله».

تقديم بطاقات الولاء / الاستبيان:
دعوة الضيف بلطف للمشاركة في تقييم الخدمة أو استخدام برامج الولاء إن وجدت.

${SEP}

The approved farewell phrase:
"Your presence has been a pleasure for us. We hope to see you again soon."

Loyalty cards and surveys:
Politely invite the guest to take part in the service evaluation, or to use the loyalty programs where these are available.`
            },

            /* ---------------------------------------------------------------
               4. الإجراءات المالية والتشغيلية على نظام الكاشير
               --------------------------------------------------------------- */
            {
                heading: "4.1 — افتتاح الصندوق / Opening Float",
                text: `الإجراء المعتمد:
استلام عهدة الصندوق النقدي (Float) في بداية الشفت، عد المبالغ وتدقيق الفئات المختلفة، وتسجيلها في النظام مع توقيع الاستلام.

المسؤول والاعتماد:
الكاشير ومسؤول الصالة المباشر.

${SEP}

The approved procedure:
Receive the cash float at the start of the shift, count the amounts, verify each denomination, and record them in the system together with a signature of receipt.

Responsible and approving parties:
The cashier and the direct floor supervisor.`
            },

            {
                heading: "4.2 — إدخال وتعديل الطلبات / Order Entry and Void",
                text: `الإجراء المعتمد:
إدخال الطلبات بدقة متناهية حسب الأقسام (صواني، أطباق رز، جباتي، مشروبات). يُمنع إلغاء أي طبق بعد الطباعة إلا بإذن وإلغاء معتمد.

المسؤول والاعتماد:
الكاشير ومشرف الشفت.

${SEP}

The approved procedure:
Enter orders with absolute accuracy according to their categories (trays, rice dishes, chapati, beverages). Voiding any dish after it has been printed is forbidden except with authorization and an approved void.

Responsible and approving parties:
The cashier and the shift supervisor.`
            },

            {
                heading: "4.3 — الإلغاء والخصومات / Voids and Discounts",
                text: `الإجراء المعتمد:
لا يتم إجراء أي خصم أو إلغاء فاتورة إلا بطلب رسمي مبرر وبحضور المشرف واعتماد كود الإلغاء أو الخصم في نظام نقاط البيع.

المسؤول والاعتماد:
مشرف الصالة أو مدير الفرع.

${SEP}

The approved procedure:
No discount or bill cancellation may be carried out except upon a formal, justified request, in the presence of the supervisor, and with the void or discount code authorized in the POS system.

Responsible and approving parties:
The floor supervisor or the branch manager.`
            },

            {
                heading: "4.4 — إغلاق الشفت والمطابقة / Shift Closing and X/Z Reports",
                text: `الإجراء المعتمد:
طباعة التقرير النهائي (Z Report)، فرز المبيعات النقدية والبطاقات وتطابقها مع المقبوضات الفعلية، وتسليم العهدة والمقبوضات في الظرف المعتمد.

المسؤول والاعتماد:
الكاشير ومسؤول الصالة.

${SEP}

The approved procedure:
Print the final report (Z Report), separate cash sales from card sales and reconcile them against the actual receipts, then hand over the float and the takings in the approved envelope.

Responsible and approving parties:
The cashier and the floor supervisor.`
            },

            {
                heading: "4.5 — إدارة الفروقات النقدية / Cash Variance Management",
                text: `الإجراء المعتمد:
في حال وجود أي زيادة أو نقص في الصندوق، يتم إبلاغ مسؤول الصالة فوراً وتدوين ذلك في محضر الإغلاق اليومي للتحقيق والمطابقة.

المسؤول والاعتماد:
الكاشير ومدير الفرع.

${SEP}

The approved procedure:
If there is any surplus or shortage in the cash drawer, the floor supervisor must be informed immediately and the discrepancy recorded in the daily closing report for investigation and reconciliation.

Responsible and approving parties:
The cashier and the branch manager.`
            },

            /* ---------------------------------------------------------------
               5. قائمة التفقد اليومية
               --------------------------------------------------------------- */
            {
                heading: "5.1 — قائمة التفقد اليومية: الجاهزية التشغيلية والمخزون / Daily Checklist: Operational Readiness and Stock",
                text: `تطبيقات التوصيل:
الالتزام بالوقت المحدد لفتح استقبال الطلبات على التطبيقات، ومراجعة المنيو الإلكتروني للتأكد من إظهار جميع الأطباق المتاحة وتطابقها مع المتوفر فعلياً بالمطبخ.
التوقيت والمسؤولية: بداية الشفت — الكاشير ومسؤول الصالة.

توفر الأطباق والمشاوي:
التأكد من توفر جميع عناصر المنيو داخل المطعم قبل الافتتاح، والتأكد المباشر من إتاحة وفتح أطباق المشاوي في الموعد المعتمد المخصص لها دون تأخير.
التوقيت والمسؤولية: قبل الافتتاح وقبل فترات الذروة.

مستلزمات التعبئة:
مراجعة وتفقّد مخزون علب التغليف والتيك أواي بكافة أحجامها (علب الأرز، الأكياس، الملاعق، الصوصات) والتحقق من كفايتها الكاملة للشفت.
التوقيت والمسؤولية: بداية كل شفت تشغيلي.

ثلاجات قسم الكاشير:
فحص ثلاجات الكاشير والتأكد من نظافتها، تبريدها الصحيح، وترتيب العصائر والمشروبات والحلويات بأسلوب أنيق ومنظم للخدمة السريعة.
التوقيت والمسؤولية: فحص دوري صباحي ومسائي.

${SEP}

Delivery applications:
Adhere to the exact time set for opening order intake on the delivery apps, and review the electronic menu to confirm that every available dish is displayed and matches what is actually available in the kitchen.
Timing and responsibility: Start of shift — the cashier and the floor supervisor.

Availability of dishes and grills:
Confirm that all menu items are available inside the restaurant before opening, and directly confirm that the grill dishes are enabled and opened at their designated approved time without delay.
Timing and responsibility: Before opening and before peak periods.

Packaging supplies:
Review and check the stock of packaging and takeaway boxes in all sizes (rice boxes, bags, spoons, sauces) and verify that they are fully sufficient for the shift.
Timing and responsibility: Start of every operational shift.

Cashier area refrigerators:
Inspect the cashier refrigerators and confirm their cleanliness, correct cooling, and the neat, organized arrangement of juices, beverages and desserts for fast service.
Timing and responsibility: Routine morning and evening inspection.`
            },

            {
                heading: "5.2 — قائمة التفقد اليومية: الأجهزة والهوية والأجواء الصوتية / Daily Checklist: Devices, Branding and Audio Ambience",
                text: `هواتف المبيعات والتواصل:
التأكد من شحن هواتف الكاشير والتوصيل بنسبة 100%، وفحص جاهزية الشواحن والاتصال بالشبكة لضمان عدم تفويت أي اتصال.
التوقيت والمسؤولية: بداية الشفت وطوال اليوم.

الملصقات والمطبوعات:
مراجعة جرد واستكمال جميع الملصقات الخاصة بالبراند (ملصقات الإغلاق، ستيكرات الهوية، ولاصق التغليف).
التوقيت والمسؤولية: بداية كل شفت تشغيلي.

الأجواء الصوتية والقرآن الكريم:
تشغيل القرآن الكريم في أرجاء المطعم صباحاً، والالتزام بتشغيل الموسيقى المعتمدة في تمام الساعة 10:00 صباحاً.
التوقيت والمسؤولية: عند الفتح والساعة 10:00 صباحاً.

إيقاف الموسيقى أثناء الأذان:
الالتزام التام والتعظيم لإيقاف تشغيل الموسيقى فوراً عند كل أذان، وإعادة تشغيلها بعد انتهاء الأذان.
التوقيت والمسؤولية: مواعيد الصلوات الخمس.

${SEP}

Sales and contact phones:
Ensure the cashier and delivery phones are charged to 100%, and check that the chargers and the network connection are ready so that no call is ever missed.
Timing and responsibility: Start of shift and throughout the day.

Stickers and printed branding:
Review, count and replenish all brand stickers (sealing stickers, identity stickers, and packaging tape).
Timing and responsibility: Start of every operational shift.

Audio ambience and the Holy Quran:
Play the Holy Quran throughout the restaurant in the morning, and switch to the approved music playlist at exactly 10:00 AM.
Timing and responsibility: At opening and at 10:00 AM.

Stopping the music during the Adhan:
Full and respectful compliance with stopping the music immediately at every call to prayer (Adhan), and resuming it once the Adhan has ended.
Timing and responsibility: The five prayer times.`
            },

            /* ---------------------------------------------------------------
               6. بروتوكول الهاتف
               --------------------------------------------------------------- */
            {
                heading: "6 — بروتوكول الرد الرسمي المعتمد على الهاتف / Official Phone Protocol",
                text: `سرعة الرد:
الإجابة على الهاتف خلال 3 رنات كحد أقصى بأسلوب محترف ونبرة صوت واضحة وودودة.

العبارة الترحيبية المعتمدة:
«يا مرحباً ومسهلا بك في ${brandAr}، معك [اسم الموظف] لخدمتك، كيف أقدر أساعدك اليوم؟».

أخذ الاستفسارات والطلبات:
• الاستماع باهتمام للضيف وتدوين جميع التفاصيل بدقة (الاسم، رقم الهاتف، تفاصيل الطلب، عنوان التوصيل أو وقت الاستلام).
• تأكيد الطلب عبر إعادة قراءته على الضيف للحد من أي خطأ.

إنهاء المكالمة والوداع:
«نشكر تواصلك معنا في ${brandAr}، ونتمنى لك يوماً سعيداً. حياك الله».

${SEP}

Speed of answering:
Answer the phone within a maximum of 3 rings, in a professional manner and with a clear, friendly tone of voice.

The approved welcome phrase:
"You are most welcome to ${brandEn}. This is [employee name] at your service. How may I help you today?"

Taking enquiries and orders:
• Listen attentively to the guest and record every detail accurately (name, phone number, order details, delivery address or collection time).
• Confirm the order by reading it back to the guest, to eliminate any error.

Ending the call and farewell:
"Thank you for contacting ${brandEn}. We wish you a pleasant day."`
            },

            /* ---------------------------------------------------------------
               7. مسؤوليات الإشراف والتدريب
               --------------------------------------------------------------- */
            {
                heading: "7 — مسؤوليات الإشراف والتدريب التشغيلي لقسم الكاشير / Supervision and Operational Training Responsibilities",
                text: `السيد عبد المالك — مسؤول صالة:
الإشراف الكامل على تدريب موظفي الكاشير في الربط التشغيلي، والتأكد من فتح الأطباق والمشاوي وتطبيقات التوصيل في أوقاتها المحددة بدقة، وعلى معايير نظافة ثلاجات الكاشير، وتوفر علب التيك أواي والملصقات، وتطبيق الاشتراطات الصحية.

السيد محمد الورداني — مسؤول صالة:
الإشراف على تدريب موظفي الكاشير في بروتوكول الرد الرسمي على الهاتف، والالتزام بالأجواء الصوتية (القرآن والموسيقى وأوقات الأذان)، وإدارة انطباع الزبون.

السيد بلال عبد الصمد:
الدعم الفني والتقني.

${SEP}

Mr. Abdelmalek — Floor Supervisor:
Full responsibility for training cashier staff in operational coordination; confirming that dishes, grills and delivery applications are opened precisely at their designated times; the cleanliness standards of the cashier refrigerators; the availability of takeaway boxes and stickers; and the application of health requirements.

Mr. Mohamed Al Ouerdani — Floor Supervisor:
Responsible for training cashier staff in the official phone protocol, compliance with the audio ambience rules (Quran, music and Adhan times), and managing the guest's overall impression.

Mr. Billel Abdessamad:
Technical and IT support.`
            }
        ];
    }

    // البراندان يشتركان في نفس الدليل — نفس الأقسام مع استبدال اسم البراند فقط.
    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "GAIMER W KAHI",
        department: "CASHIER",
        sourceFile: "training-content/cashier-shared.js",
        sections: buildSections("قيمر وكاهي", "Gaimer W Kahi")
    });

    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "SHAI BU HAMAD",
        department: "CASHIER",
        sourceFile: "training-content/cashier-shared.js",
        sections: buildSections("شاي بوحمد", "Shai Bu Hamad")
    });
})();
