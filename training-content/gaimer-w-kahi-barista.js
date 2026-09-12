/* =============================================================================
   محتوى التدريب — قيمر وكاهي / قسم الباريستا والمشروبات
   Training Content — Gaimer W Kahi / Barista & Beverages
   -----------------------------------------------------------------------------
   المصدر: «البرنامج التدريبي الشامل والمدقق لكادر الباريستا والمشروبات» —
   دليل التدريب التشغيلي والسجل الفني للمشروبات — إدارة قيمر وكاهي.

   ملاحظة على السجل الفني:
   ------------------------
   خانتا «المكونات والمقادير» و«طريقة التحضير والملاحظات» تركهما المستند
   الأصلي فارغتين عمدًا ليُدوّنهما الباريستا/المشرف لاحقًا ويعتمدهما. لذلك
   عُرضت هنا كسطر لكل مشروب: الاسم (عربي/إنجليزي) + السعر، مع علامة (…) تشير
   إلى أن المكونات وطريقة التحضير تُستكمل لاحقًا. حين تُرسل الإدارة الوصفات
   الفعلية، تُضاف تحت كل مشروب دون تغيير البنية.

   ملاحظات تقنية: انظر تعليقات gaimer-w-kahi-hospitality.js — نفس البنية،
   ونفس قاعدة الأسطر الفارغة التي تحدد اتجاه كل فقرة تلقائيًا في الكيوسك.
   ============================================================================= */

(function () {
    "use strict";

    window.TRAINING_CONTENT_REGISTRY = window.TRAINING_CONTENT_REGISTRY || [];

    var SEP = "———————————————";

    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "GAIMER W KAHI",
        department: "BARISTA",
        sourceFile: "training-content/gaimer-w-kahi-barista.js",
        sections: [

            /* ---------------------------------------------------------------
               المقدمة والأهداف
               --------------------------------------------------------------- */
            {
                heading: "مقدمة الدليل والأهداف التشغيلية — Introduction and Operational Objectives",
                text: `البرنامج التدريبي الشامل والمدقق لكادر الباريستا والمشروبات
مطعم قيمر وكاهي — دليل التدريب التشغيلي والسجل الفني للمشروبات

يهدف هذا البرنامج التدريبي والتأهيلي الشامل إلى تدريب وتأهيل جميع موظفي الباريستا ومحضّري المشروبات في «قيمر وكاهي» على أعلى المعايير التشغيلية الاحترافية.

يغطي البرنامج كافة تفاصيل إعداد المشروبات الساخنة والباردة، والعصائر الطازجة، والخلطات الخاصة، للالتزام التام بالمعايير والدقة في التقديم وسلامة الغذاء.

${SEP}

Comprehensive and Audited Training Program for Barista and Beverage Staff
Gaimer W Kahi Restaurant — Operational Training Guide and Technical Beverage Log

This comprehensive training and qualification program aims to train and qualify all baristas and beverage preparers at "Gaimer W Kahi" to the highest professional operational standards.

The program covers every detail of preparing hot and cold drinks, fresh juices and signature blends, ensuring full commitment to standards, precision in presentation, and food safety.`
            },

            /* ---------------------------------------------------------------
               المحاور التدريبية الأساسية
               --------------------------------------------------------------- */
            {
                heading: "المحور 1 — الالتزام بالوصفات المعيارية والعيارات / Standard Recipe & Measurement Control",
                text: `الالتزام ببطاقة الوصفة (Recipe Card):
الالتزام بالمعايير والعيارات المحددة لكل مشروب لضمان ثبات النكهة والجودة في كل كوب.

الوزن والقياس الدقيق:
استخدام الموازين الرقمية وأكواب المعايرة لجرعات القهوة والشاي والصوصات دون تقدير عشوائي.

اختبار المعايرة والحرارة:
فحص استخلاص الإسبريسو ودرجة حرارة تبخير الحليب وتذوق العصائر لضمان ضبط الجودة.

التحكم في الهدر (Wastage Control):
التقيّد بالكميات المحددة للحليب والقهوة والفواكه للحد من الهدر الحاصل أثناء الإعداد.

${SEP}

Adherence to the Recipe Card:
Follow the defined standards and measurements for each drink to guarantee consistent flavor and quality in every cup.

Accurate weighing and measuring:
Use digital scales and measuring cups for coffee, tea and sauce doses — never estimate by guesswork.

Calibration and temperature testing:
Check espresso extraction, milk-steaming temperature, and taste the juices to keep quality under control.

Wastage control:
Keep to the defined quantities of milk, coffee and fruit to reduce the waste that occurs during preparation.`
            },

            {
                heading: "المحور 2 — التجهيز والتحضير المسبق / Mise en Place & Prep Protocol",
                text: `تجهيز المحطة:
تنظيف وتعبئة مطاحن القهوة، صوصات المشروبات، المقطّرات، والشرابات قبل انطلاق الشفت.

نظام FIFO للتدوير:
تطبيق نظام التدوير (الأقدم أولاً) على الحليب، الفواكه الطازجة، والسيروبات، والتأكد من تاريخ الصلاحية.

صيانة وتنظيف الأدوات:
تنظيف بورتافلتر القهوة، بتشرات التبخير، الخلاطات، وعصّارات الفواكه وتعقيمها بانتظام.

${SEP}

Station setup:
Clean and refill the coffee grinders, drink sauces, drippers and syrups before the shift begins.

FIFO rotation system:
Apply first-in-first-out rotation to milk, fresh fruit and syrups, and always check the expiry date.

Equipment maintenance and cleaning:
Clean and sanitize the coffee portafilter, steaming pitchers, blenders and juicers regularly.`
            },

            {
                heading: "المحور 3 — سلامة الغذاء والنظافة والتعقيم / Hygiene & Safety Standards",
                text: `غسل وتعقيم اليدين:
غسل اليدين بانتظام واستخدام القفازات عند التعامل المباشر مع الفواكه والتزيين.

درجات الحرارة الحرجة:
• حفظ الحليب والمواد الباردة: أقل من 4 درجات مئوية.
• درجة حرارة تبخير الحليب المثالية: بين 60°C و 65°C (عدم تجاوز 70°C لتجنب احتراق الحليب).
• حرارة تقديم الشاي والمشروبات الساخنة: تُقدّم فور إعدادها في أوانيها المخصصة.

التعقيم المستمر (Clean-as-you-go):
مسح عصا التبخير (Steam Wand) فوراً بعد كل عملية تبخير، وتعقيم أسطح العمل باستمرار.

${SEP}

Hand washing and sanitizing:
Wash hands regularly and wear gloves when handling fruit and garnishes directly.

Critical temperatures:
• Storing milk and cold items: below 4°C.
• Ideal milk-steaming temperature: between 60°C and 65°C (never exceed 70°C, to avoid scorching the milk).
• Serving temperature for tea and hot drinks: serve immediately after preparation in their designated vessels.

Clean-as-you-go sanitizing:
Wipe the steam wand immediately after every steaming, and continuously sanitize the work surfaces.`
            },

            /* ---------------------------------------------------------------
               المحور 4: السجل الفني للمشروبات
               --------------------------------------------------------------- */
            {
                heading: "المحور 4 — كيفية استخدام السجل الفني للمشروبات / How to Use the Technical Beverage Log",
                text: `الأقسام التالية هي سجل فني بأسعار كل مشروب في المنيو.

خانتا «المكونات والمقادير» و«طريقة التحضير والملاحظات» متروكتان للتدوين والاعتماد المباشر من الباريستا والمشرف. حين تُعتمد الوصفة الرسمية لكل مشروب، تُضاف مكوناته وطريقة تحضيره تحت اسمه.

علامة (…) بعد كل مشروب تعني أن الوصفة لم تُدوَّن بعد.

${SEP}

The following sections are a technical log of every menu drink and its price.

The "Ingredients & Measurements" and "Preparation Method & Notes" fields are left for the barista and supervisor to record and approve directly. Once the official recipe for each drink is approved, its ingredients and preparation method are added beneath its name.

An ellipsis (…) after a drink means its recipe has not yet been recorded.`
            },

            {
                heading: "المحور 4 — المشروبات الساخنة: الشاي والحليب والكرك / Hot Drinks: Tea, Milk & Karak",
                text: `76 — قوري شاي مخدر صغير / Tea Kettle Small — QAR 32.00 (…)

77 — قوري چاي مخدر كبير مع سخان / Big Mukadar Tea Pot with Heater — QAR 75.00 (…)

78 — حليب ساخن / Hot Milk — QAR 12.00 (…)

79 — قوري كرك صغير / Karak Kettle Small — QAR 32.00 (…)

80 — قوري كرك كبير / Big Karak Kettle — QAR 75.00 (…)

${SEP}

76 — Tea Kettle Small — QAR 32.00 (recipe to be recorded)

77 — Big Mukadar Tea Pot with Heater — QAR 75.00 (recipe to be recorded)

78 — Hot Milk — QAR 12.00 (recipe to be recorded)

79 — Karak Kettle Small — QAR 32.00 (recipe to be recorded)

80 — Big Karak Kettle — QAR 75.00 (recipe to be recorded)`
            },

            {
                heading: "المحور 4 — المشروبات الساخنة: القهوة العربية والتركية / Hot Drinks: Arabic & Turkish Coffee",
                text: `81 — قهوة عربية حجم متوسط / Arabic Coffee Medium — QAR 55.00 (…)

82 — قهوة عربية حجم كبير / Arabic Coffee Big — QAR 75.00 (…)

93 — قهوة تركية / Turkish Coffee — QAR 15.00 (…)

${SEP}

81 — Arabic Coffee, Medium Size — QAR 55.00 (recipe to be recorded)

82 — Arabic Coffee, Big Size — QAR 75.00 (recipe to be recorded)

93 — Turkish Coffee — QAR 15.00 (recipe to be recorded)`
            },

            {
                heading: "المحور 4 — مشروبات الإسبريسو والحليب / Espresso & Milk-Based Coffee",
                text: `83 — اسبريسو / Espresso — QAR 12.00 (…)

84 — دبل اسبريسو / Double Espresso — QAR 14.00 (…)

85 — كورتادو / Cortado — QAR 25.00 (…)

86 — أمريكانو / Americano — QAR 25.00 (…)

87 — كابوتشينو / Cappuccino — QAR 25.00 (…)

88 — فلات وايت / Flat White — QAR 25.00 (…)

89 — كافيه لاتيه / Café Latte — QAR 25.00 (…)

90 — سبانيش لاتيه / Spanish Latte — QAR 25.00 (…)

${SEP}

83 — Espresso — QAR 12.00 (recipe to be recorded)

84 — Double Espresso — QAR 14.00 (recipe to be recorded)

85 — Cortado — QAR 25.00 (recipe to be recorded)

86 — Americano — QAR 25.00 (recipe to be recorded)

87 — Cappuccino — QAR 25.00 (recipe to be recorded)

88 — Flat White — QAR 25.00 (recipe to be recorded)

89 — Café Latte — QAR 25.00 (recipe to be recorded)

90 — Spanish Latte — QAR 25.00 (recipe to be recorded)`
            },

            {
                heading: "المحور 4 — مشروبات القهوة الباردة / Iced Coffee Drinks",
                text: `94 — آيس كوفي / Ice Coffee — QAR 25.00 (…)

95 — آيس سبانيش لاتيه / Iced Spanish Latte — QAR 25.00 (…)

${SEP}

94 — Ice Coffee — QAR 25.00 (recipe to be recorded)

95 — Iced Spanish Latte — QAR 25.00 (recipe to be recorded)`
            },

            {
                heading: "المحور 4 — العصائر الطازجة والموهيتو / Fresh Juices & Mojitos",
                text: `97 — موهيتو الأزرق / Blue Mojito — QAR 30.00 (…)

98 — موهيتو التوت البري / Raspberry Mojito — QAR 30.00 (…)

99 — عصير كركديه / Rosella (Hibiscus) Juice — QAR 20.00 (…)

100 — إناء لبن عراقي / Iraqi Laben Jug — QAR 20.00 (…)

101 — عصير رمان طازج / Fresh Pomegranate Juice — QAR 25.00 (…)

102 — عصير برتقال طازج / Fresh Orange Juice — QAR 20.00 (…)

103 — عصير تفاح طازج / Fresh Apple Juice — QAR 25.00 (…)

105 — عصير أناناس طازج / Fresh Pineapple Juice — QAR 25.00 (…)

106 — عصير ليمونادة / Lemonade — QAR 20.00 (…)

107 — عصير ليمونادة بالنعناع / Lemonade with Mint — QAR 25.00 (…)

${SEP}

97 — Blue Mojito — QAR 30.00 (recipe to be recorded)

98 — Raspberry Mojito — QAR 30.00 (recipe to be recorded)

99 — Rosella (Hibiscus) Plant Juice — QAR 20.00 (recipe to be recorded)

100 — Iraqi Laben Jug — QAR 20.00 (recipe to be recorded)

101 — Fresh Pomegranate Juice — QAR 25.00 (recipe to be recorded)

102 — Fresh Orange Juice — QAR 20.00 (recipe to be recorded)

103 — Fresh Apple Juice — QAR 25.00 (recipe to be recorded)

105 — Fresh Pineapple Juice — QAR 25.00 (recipe to be recorded)

106 — Lemonade Juice — QAR 20.00 (recipe to be recorded)

107 — Lemonade with Mint — QAR 25.00 (recipe to be recorded)`
            },

            {
                heading: "المحور 4 — المشروبات الغازية والمياه / Soft Drinks & Water",
                text: `108 — ماء صغير / Small Water — QAR 7.00 (…)

109 — ماء كبير / Big Water — QAR 16.00 (…)

110 — كوكا كولا عادي / Coca-Cola — QAR 12.00 (…)

111 — كوكا كولا زيرو / Coca-Cola Zero — QAR 12.00 (…)

117 — كوكا كولا دايت / Coca-Cola Diet — QAR 12.00 (…)

112 — فانتا / Fanta — QAR 12.00 (…)

113 — سبرايت / Sprite — QAR 12.00 (…)

114 — كينزي / Kenzi — QAR 12.00 (…)

115 — كينزي كولا / Kenzi Cola — QAR 12.00 (…)

116 — مشروب طاقة (ريد بُل) / Red Bull Energy Drink — QAR 25.00 (…)

${SEP}

108 — Small Water — QAR 7.00 (recipe to be recorded)

109 — Big Water — QAR 16.00 (recipe to be recorded)

110 — Coca-Cola — QAR 12.00 (recipe to be recorded)

111 — Coca-Cola Zero — QAR 12.00 (recipe to be recorded)

117 — Coca-Cola Diet — QAR 12.00 (recipe to be recorded)

112 — Fanta — QAR 12.00 (recipe to be recorded)

113 — Sprite — QAR 12.00 (recipe to be recorded)

114 — Kenzi — QAR 12.00 (recipe to be recorded)

115 — Kenzi Cola — QAR 12.00 (recipe to be recorded)

116 — Red Bull Energy Drink — QAR 25.00 (recipe to be recorded)`
            }
        ]
    });
})();
