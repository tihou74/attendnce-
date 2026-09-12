/* =============================================================================
   محتوى التدريب — قيمر وكاهي / قسم التنظيف وغسيل الصحون (Stewarding)
   Training Content — Gaimer W Kahi / Cleaning & Stewarding
   -----------------------------------------------------------------------------
   المصدر: «البرنامج التدريبي الشامل لعمال النظافة» — استنادًا إلى دليل قواعد
   ممارسات سلامة الأغذية والاشتراطات الصحية لوزارة الصحة العامة بدولة قطر
   (MoPH) ونظام HACCP — إعداد إدارة مطعم قيمر وكاهي (فرع الوست ووك).

   النص الإنجليزي هنا هو النص الرسمي الذي أرسلته الإدارة (لم يُترجَم آليًا).

   نطاق الاستخدام: بتوجيه الإدارة، هذا الدليل مشترك بين البراندين (قيمر وكاهي
   وشاي بوحمد)، فيُسجَّل مستندان: GAIMER_W_KAHI__CLEANER و
   SHAI_BU_HAMAD__CLEANER. المحتوى واحد لأن بروتوكولات السلامة الغذائية
   (MoPH/HACCP) وأسماء المشرفين مشتركة، ولا يوجد اسم براند يُنطق للضيف داخل
   نص دليل النظافة (بخلاف الكاشير) فلا حاجة لاستبدال أي اسم.

   ملاحظة في المستند الأصلي — وُثّقت ولم تُعالَج باختراع:
   • فقرة المقدمة الأصلية ذكرت «شاي بوحمد / Chai Bohmad» بينما الترويسة والخاتمة
     «قيمر وكاهي / GAIMER W KAHI». بما أن الدليل صار مشتركًا للبراندين، لم يعد
     التعارض ذا أثر؛ وأُبقي على نص المقدمة كما أُعيدت صياغته أعلاه.
   • ترقيم الأقسام يقفز: النسخة العربية تنتقل من 6 إلى 8 (لا يوجد قسم 7)،
      والنسخة الإنجليزية تكرّر الرقم في الترقيم — أُبقيت العناوين وترتيبها كما
      في المصدر دون إعادة ترقيم قسري.

   ملاحظات تقنية: انظر تعليقات gaimer-w-kahi-hospitality.js — نفس البنية،
   ونفس قاعدة الأسطر الفارغة التي تحدد اتجاه كل فقرة تلقائيًا في الكيوسك.
   ============================================================================= */

(function () {
    "use strict";

    window.TRAINING_CONTENT_REGISTRY = window.TRAINING_CONTENT_REGISTRY || [];

    var SEP = "———————————————";

    // دليل النظافة مشترك بين البراندين (بتوجيه الإدارة) — المحتوى واحد لأن
    // بروتوكولات السلامة الغذائية (MoPH/HACCP) وأسماء المشرفين واحدة للفرعين،
    // فلا يوجد اسم براند يُستبدل داخل النص. لذا نبني الأقسام مرة واحدة ونسجّلها
    // لكلا المستندين: GAIMER_W_KAHI__CLEANER و SHAI_BU_HAMAD__CLEANER.
    var CLEANER_SECTIONS = [

            /* ---------------------------------------------------------------
               1. المقدمة والهدف
               --------------------------------------------------------------- */
            {
                heading: "1 — المقدمة والهدف من البرنامج / Introduction and Objectives",
                text: `البرنامج التدريبي الشامل لعمال النظافة (فريق غسيل الصحون — Stewarding)
استنادًا إلى دليل قواعد ممارسات سلامة الأغذية والاشتراطات الصحية لوزارة الصحة العامة بدولة قطر (MoPH) ونظام HACCP.
إعداد وتطوير: إدارة مطعم قيمر وكاهي — فرع الوست ووك.

يهدف هذا البرنامج إلى تدريب وتأهيل فريق التنظيف وغسيل الصحون على أعلى معايير السلامة الغذائية والنظافة والصحة العامة المعتمدة من وزارة الصحة العامة في دولة قطر (MoPH).

يضمن هذا البرنامج الحد من التلوث الخلطي، وتطبيق آليات الغسيل والتطهير الصحيحة، وحماية صحة وسلامة الضيوف والموظفين.

${SEP}

Comprehensive Training Program for Cleaning Staff (Stewarding Team)
Based on the Food Safety Code of Practice & Health Regulations — Ministry of Public Health, Qatar (MoPH) & HACCP System.
Prepared and Developed by Management of GAIMER W KAHI Restaurant — West Walk Branch.

This program aims to train and qualify the cleaning and dishwashing team (Stewarding Team) on the highest standards of food safety, hygiene, and public health approved by the Ministry of Public Health in Qatar (MoPH).

This program ensures the prevention of cross-contamination, execution of correct washing and sanitizing procedures, and protection of the health and safety of guests and staff.`
            },

            /* ---------------------------------------------------------------
               2. الصحة والسلامة الشخصية
               --------------------------------------------------------------- */
            {
                heading: "2 — اشتراطات الصحة والسلامة الشخصية / Personal Health and Safety Requirements",
                text: `الشهادة الصحية:
الالتزام بوجود شهادة صحية سارية المفعول وصادرة من الجهات المختصة في قطر لكل عامل.

المظهر العام والزي الرسمي:
ارتداء الزي المخصص النظيف، غطاء الرأس الكامل، وأحذية السلامة المقاومة للانزلاق.

الابتعاد عن العمل عند المرض:
الإبلاغ الفوري للإدارة في حال وجود أعراض مرضية (مثل أعراض الجهاز الهضمي أو الحمى/الزكام) وتجنب التعامل مع الأواني.

قواعد غسل اليدين الصارمة:
غسل اليدين بماء دافئ وصابون مضاد للبكتيريا لمدة 20 ثانية على الأقل في الحالات التالية:
• قبل بدء العمل أو ارتداء القفازات.
• بعد التعامل مع الصحون والأواني المتسخة وقبل لمس الأواني النظيفة.
• بعد استخدام دورات المياه أو التخلص من النفايات.
• بعد العطس، السعال، أو لمس الوجه.

معدات الحماية الشخصية (PPE):
ارتداء القفازات المخصصة للتنظيف (Heavy-duty gloves)، المآزر المائية (Waterproof aprons)، والنظارات الواقية عند التعامل مع المواد الكيميائية المركّزة.

${SEP}

Health Certificate:
Strict compliance with having a valid medical health certificate issued by competent authorities in Qatar for every worker.

General Appearance and Uniform:
Wearing designated clean uniforms, full hairnets/head covers, and non-slip safety shoes.

Exclusion Due to Illness:
Immediate reporting to management upon experiencing illness symptoms (such as gastrointestinal distress or fever/cold symptoms) and refraining from handling utensils.

Strict Handwashing Protocols:
Washing hands with warm water and antibacterial soap for at least 20 seconds under the following circumstances:
• Before starting work or putting on gloves.
• After handling dirty dishes and utensils, and before touching clean ones.
• After using restrooms or disposing of waste.
• After sneezing, coughing, or touching the face.

Personal Protective Equipment (PPE):
Wearing heavy-duty gloves, waterproof aprons, and safety goggles when handling concentrated chemicals.`
            },

            /* ---------------------------------------------------------------
               3. غسيل الصحون — يدوي وآلي
               --------------------------------------------------------------- */
            {
                heading: "3.1 — الغسيل اليدوي بحوض الغسيل الثلاثي / Manual Washing: Three-Compartment Sink",
                text: `يُطبّق هذا البروتوكول بدقة لضمان التعقيم الكامل وفق المعايير القطرية:

0. الإزالة المبدئية (Scraping):
إزالة بقايا الطعام من الأطباق والأواني في سلة المهملات قبل إدخالها للأحواض. — حرارة الغرفة.

1. الحوض الأول: الغسيل (Wash):
فرك الصحون بالماء الدافئ والمنظف المعتمد (Food-grade detergent). — لا تقل عن 45°C.

2. الحوض الثاني: الشطف (Rinse):
شطف الصحون جيداً بماء نظيف لإزالة أي بقايا للصابون والمنظفات. — ماء دافئ نظيف (45°C – 50°C).

3. الحوض الثالث: التطهير/التعقيم (Sanitize):
نقع الصحون والأدوات في محلول التعقيم الكيميائي (الكلور أو مركبات الأمونيوم الرباعية) أو ماء ساخن. — تعقيم كيميائي حسب تركيز المصنع، أو تعقيم حراري بماء لا يقل عن 77°C لمدة 30 ثانية.

4. التجفيف بالهواء الطبيعي (Air Drying):
ترك الأدوات لتجف تلقائياً على رفوف شبكية نظيفة. يُمنع منعاً باتاً استخدام الفوط للتجفيف لتجنب التلوث. — منطقة تجفيف نظيفة ومجهزة.

${SEP}

Apply this protocol precisely to ensure complete sanitization per Qatari standards:

0. Scraping:
Remove food residue from dishes and utensils into trash bins before placing them in sinks. — Room temperature.

1. Sink 1: Wash:
Scrub dishes using warm water and approved food-grade detergent. — Not less than 45°C.

2. Sink 2: Rinse:
Thoroughly rinse dishes with clean water to remove soap and detergent residues. — Clean warm water (45°C – 50°C).

3. Sink 3: Sanitize:
Soak dishes and utensils in a chemical sanitizing solution (chlorine or quaternary ammonium compounds) or hot water. — Chemical sanitizer per manufacturer specs, or thermal sanitization in water at ≥ 77°C for 30 seconds.

4. Air Drying:
Allow items to air dry naturally on clean wire racks. Do not use towels to dry items, to prevent recontamination. — Clean, dedicated drying area.`
            },

            {
                heading: "3.2 — الغسيل الآلي بغسالة الصحون التجارية / Mechanical Washing: Commercial Dishwasher",
                text: `درجة حرارة الشطف النهائي (High-Temp Rinse):
يجب أن تصل درجة حرارة الشطف النهائي إلى 82°C لضمان القضاء على الميكروبات.

التحقق اليومي:
فحص تركيز المواد الكيميائية (Disinfectant/Detergent) وقياس الحرارة وتسجيلها في السجل اليومي.

التنظيم داخل السلال:
وضع الأطباق والأكواب بشكل يسمح بوصول رذاذ الماء لكافة الأسطح دون تراكم.

${SEP}

High-Temp Final Rinse:
Final rinse temperature must reach 82°C to ensure complete microbial destruction.

Daily Verification:
Check chemical concentrations (detergent/sanitizer), measure temperatures, and record them in the daily log.

Rack Loading:
Arrange plates, cups, and utensils systematically so water spray covers all surfaces without obstruction.`
            },

            /* ---------------------------------------------------------------
               4. مصيدة الدهون
               --------------------------------------------------------------- */
            {
                heading: "4.1 — مصيدة الدهون: الأدوات والمعدات / Grease Trap: Equipment & Tools",
                text: `مصيدة الدهون (Grease Trap) مسؤولة عن تجميع الدهون والزيوت والشحوم لضمان عدم انسداد الصرف الصحي والامتثال للأنظمة البيئية والصحية بدولة قطر. تُنظَّف يومياً نهاية كل وردية.

الأدوات والمعدات المستعملة:
• قفازات مطاطية ثقيلة مخصصة للتنظيف الشاق.
• كمامة واقية للوجه ونظارات حماية شفافة.
• مغرفة طويلة الساق أو كشاطة استيل مسطحة.
• دلو أو سطل محكم الإغلاق مخصص لجمع الشحوم.
• مادة مزيل الدهون (Degreaser): 2 كجم لكل عملية تنظيف لإذابة الرواسب المستعصية.
• فرشاة سلكية/خشنة لتنظيف المكونات الداخلية.
• فوط تنظيف بلون مخصص ومحارم امتصاص زيتي.
• أكياس سميكة مخصصة للتخلص من النفايات الصلبة للشحوم.

${SEP}

The grease trap captures fats, oils and grease (FOG) to prevent drain blockages and ensure compliance with environmental and health regulations in Qatar. It must be cleaned daily at the end of each shift.

Equipment & Tools Required:
• Heavy-duty rubber gloves.
• Protective face mask & transparent safety goggles.
• Long-handled scoop or stainless steel flat scraper.
• Dedicated, sealable bucket for grease collection.
• Chemical degreaser: 2 kg per cleaning cycle to dissolve stubborn deposits.
• Wire/stiff-bristled brush for internal components.
• Color-coded cleaning cloths and oil-absorbent towels.
• Heavy-duty trash bags for solid grease disposal.`
            },

            {
                heading: "4.2 — مصيدة الدهون: خطوات التنظيف اليومي / Grease Trap: Daily Cleaning Steps",
                text: `1. التجهيز وارتداء السلامة: ارتداء القفازات الثقيلة والكمامة والنظارة الواقية، مع التأكد من إيقاف جريان الماء عبر الأحواض المتصلة بالمصيدة.

2. فتح غطاء المصيدة: فك براغي أو مقابض الغطاء بحذر، وإزالته جانباً وتفقّد مستوى الدهون المتراكمة.

3. كشط وتفريغ الطبقة العائمة (Skimming): إزالة طبقة الدهون العائمة والشحوم الصلبة بعناية ووضعها داخل الدلو المحكم. (يُمنع منعاً باتاً سكب الدهون في مجاري الصرف الصحي).

4. تفريغ الحاجز الداخلي والمصفاة: رفع حاجز المصيدة (Baffle Plate) والمصفاة وتفريغ بقايا الطعام الصلبة من القاع.

5. تطبيق مزيل الدهون (2 كجم): توزيع 2 كجم من مادة مزيل الدهون داخل جدران المصيدة، وتركها 10 إلى 15 دقيقة للتفاعل مع الدهون وإذابتها بالكامل.

6. دعك الغرفة والأنابيب: فرك الجدران والفواصل والغطاء بالفرشاة الخشنة مع الماء الدافئ لإزالة جميع التراكمات.

7. الشطف وإعادة التركيب: شطف الأجزاء بالماء الدافئ، إعادة تركيب الحاجز والمصفاة في أماكنها، ثم إغلاق الغطاء بإحكام لمنع تسرب الرائحة.

8. التخلص الآمن من النفايات: إغلاق كيس النفايات المحتوي على الدهون بإحكام وإلقاؤه في الحاوية المخصصة للشحوم والزيوت.

${SEP}

1. Preparation & PPE: Put on heavy-duty gloves, mask and goggles, and ensure water flow to connected sinks is shut off.

2. Open the Trap Cover: Loosen screws/latches carefully, set the cover aside, and inspect grease buildup.

3. Skim the Grease Layer: Carefully remove the floating grease layer and solid fats into the sealed bucket. (Never pour grease into drainage lines).

4. Empty Baffle & Screen: Lift out the internal baffle plate and strainer basket; clear out solid food particles from the bottom.

5. Apply Degreasing Agent (2 kg): Distribute 2 kg of heavy-duty degreaser across the internal walls, and allow it to sit for 10 to 15 minutes to react with and dissolve the grease.

6. Scrub Interior & Pipes: Scrub internal walls, dividers, and cover thoroughly using the stiff brush and warm water.

7. Rinse & Reassemble: Rinse all components with warm water, reinstall the baffle plate and strainer correctly, and secure the cover tightly to prevent odors.

8. Safe Waste Disposal: Seal the trash bag containing the collected grease tightly and dispose of it in the designated grease/oil disposal units.`
            },

            /* ---------------------------------------------------------------
               5. الأرضيات
               --------------------------------------------------------------- */
            {
                heading: "5.1 — تنظيف الأرضيات: الأدوات والمواد / Floor Cleaning: Equipment & Materials",
                text: `تنظيف الأرضيات يتطلب التزاماً كاملاً لمنع الانزلاقات والحفاظ على أعلى مستويات التعقيم والتخلص من الدهون الزيتية الساقطة أثناء التحضير.

الأدوات والمواد المستعملة:
• فرشاة أرضيات خشنة بيد طويلة.
• قشاطة أرضيات مطاطية (Squeegee).
• دلو مزدوج مع نظام عصر الممسحة.
• ممسحة أرضيات خيطية.
• سائل تنظيف أرضيات ومزيل دهون.
• مادة مطهرة ومعقمة (محلول الكلور أو المطهر الغذائي).
• لوحات تحذيرية «أرضية مبللة».

${SEP}

Cleaning kitchen floors requires strict adherence to prevent slip hazards, maintain sanitization, and remove accumulated oils and grease.

Equipment & Materials Required:
• Heavy-duty long-handled floor scrubbing brush.
• Rubber floor squeegee.
• Double-bucket mop system with wringer.
• Cotton string mop head.
• Floor cleaner & heavy-duty degreaser.
• Sanitizing/disinfecting agent (chlorine solution or food-grade sanitizer).
• "Wet Floor" caution signs.`
            },

            {
                heading: "5.2 — تنظيف الأرضيات: خطوات التنظيف اليومي / Floor Cleaning: Daily Steps",
                text: `1. وضع اللوحات التحذيرية: وضع لوحة «أرضية مبللة / Caution Wet Floor» عند المداخل والممرات لحماية العمال والموظفين.

2. الكنس الجاف (Dry Sweeping): كنس الأرضيات بالكامل لإزالة الأتربة وبقايا الطعام والأجسام الصلبة قبل استخدام أي ماء.

3. تحضير محلول التنظيف: خلط الماء الدافئ مع المنظف ومزيل الدهون بالتركيز الموصى به من المصنع داخل الدلو الأول.

4. توزيع المحلول والفرك: سكب الصابون ومزيل الدهون على الأرضية خاصة في أماكن الطبخ وغسيل الصحون وتحت المعدات، ودعك الأرضية والزوايا والأخاديد (Grout lines) بالفرشاة الخشنة لإزالة الزيوت المستعصية.

5. سحب المياه القذرة (Squeegee): استخدام القشاطة المطاطية لسحب كافة المياه القذرة والرغوة باتجاه فتحات التصريف.

6. المسح والتطهير النهائي: تجهيز الدلو الثاني بماء نظيف مضاف إليه المطهر، ومسح الأرضية بأسلوب الحركة القوسية (Figure-8) لضمان تغطية كافة المساحات بالمعقم.

7. التجفيف والتهوية: ترك الأرضية لتجف تماماً بالتهوية الطبيعية أو المروحة قبل إزالة اللوحات التحذيرية.

${SEP}

1. Display Safety Signs: Place "Caution Wet Floor" signs at entrances and walkways around the target area.

2. Dry Sweeping: Sweep floors completely to remove loose dust, food debris and solid items before applying water.

3. Prepare Cleaning Solution: Mix warm water with the floor cleaner and degreaser according to manufacturer ratios in the first bucket.

4. Apply Solution & Scrub: Pour the detergent solution onto the floor, focusing on cooking lines, dishwashing zones and under equipment, then scrub floors, corners and grout lines vigorously with the stiff brush to loosen stubborn grease.

5. Squeegee Dirty Water: Use the rubber squeegee to scrape all dirty water and foam directly into floor drains.

6. Mop & Sanitize: Prepare the second bucket with clean water mixed with the sanitizing agent, and mop the area using a figure-8 pattern to ensure complete surface coverage.

7. Drying & Ventilation: Allow the floor to air dry completely via ventilation before removing caution signs.`
            },

            /* ---------------------------------------------------------------
               6. نظام الترميز اللوني للمناشف
               --------------------------------------------------------------- */
            {
                heading: "6.1 — نظام الترميز اللوني للمناشف والفوط / Color-Coded Cloth & Towel System",
                text: `يمنع هذا النظام التلوث الخلطي بين المناطق، وهو إلزامي لجميع العاملين في التنظيف والصالة والمطبخ:

الأزرق (Blue): منطقة الصالة والضيوف — مسح وتلميع طاولات الضيوف والكراسي وكاونتر الاستقبال. يُستخدم فقط مع مطهر أسطح آمن، ويُحظر إدخاله إلى المطبخ أو دورات المياه.

الأخضر (Green): مناطق تحضير الطعام والمطبخ — مسح أسطح العمل وألواح التقطيع ومعدات التحضير. يجب أن تكون فوطاً معقمة ومطابقة للمواصفات الغذائية.

الأصفر (Yellow): منطقة غسيل الصحون والأواني — تنظيف أحواض الغسيل والأسطح المحيطة ومعدات الطبخ المتسخة بالدهون. تُستخدم لمسح رذاذ الماء وتكتلات الدهون حول الأحواض.

الأحمر (Red): مناطق الخطورة العالية ودورات المياه — تنظيف حمامات الموظفين والضيوف ومغاسل التواليت وحاويات النفايات. تُحفظ وتُغسل بشكل منفصل تماماً، ويُمنع منعاً باتاً خروجها من منطقة دورات المياه.

${SEP}

This system prevents cross-contamination between operational zones and is mandatory for all cleaning, service and kitchen personnel:

Blue: Dining Area & Guest Service — wiping and polishing guest tables, chairs and reception counters. Use strictly with surface-safe disinfectant; prohibited in kitchen or restrooms.

Green: Kitchen & Food Prep Areas — wiping food-contact surfaces, cutting boards and prep equipment. Must be sanitized, food-grade cloths.

Yellow: Dishwashing & Stewarding Area — cleaning dishwashing sinks, surrounding counters and greasy cooking gear. Used to wipe water splashes and grease around the sinks.

Red: High-Risk Zones & Restrooms — cleaning staff/guest toilets, bathroom sinks and waste bins. Stored and washed completely separate from other cloths; must never leave the restroom area.`
            },

            {
                heading: "6.2 — قواعد إدارة وصيانة المناشف الملونة / Color-Coded Cloth Management Rules",
                text: `ممنوع الاستخدام الخاطئ:
يُمنع منعاً باتاً استخدام المناشف الحمراء في الصالة أو المطبخ، أو استخدام فوط الصالة (الزرقاء) في مناطق الغسيل.

الغسيل والتعقيم اليومي:
نقع وتجميع المناشف المستعملة نهاية اليوم كل لون على حدة في محلول ماء ساخن مع مطهر الكلور (50–100 ppm) ثم غسلها في الغسالة.

التخزين الصحيح:
تخزين المناشف النظيفة والجافة في أرفف أو أدراج مغلقة ومخصصة لكل لون بشكل منفصل.

${SEP}

Prohibited Misuse:
Never use red cloths in dining or kitchen areas, or blue cloths in dishwashing zones.

Daily Laundering & Sanitizing:
Soak and collect used cloths by color at the end of the shift in a hot water and chlorine solution (50–100 ppm) before machine washing.

Hygienic Storage:
Store clean, dry cloths in designated closed shelves or drawers, separated by color.`
            },

            /* ---------------------------------------------------------------
               7. النفايات والآفات
               --------------------------------------------------------------- */
            {
                heading: "7 — إدارة النفايات والوقاية من الآفات / Waste Management and Pest Control",
                text: `حاويات النفايات:
يجب أن تكون مزودة بأغطية تُفتح بالقدم (Foot-operated) وتُبطَّن بأكياس بلاستيكية محكمة.

تفريغ النفايات:
إفراغ الحاويات بانتظام بمجرد امتلائها لثلاثة أرباعها، وتنظيفها وتعقيمها يومياً.

المحافظة على النظافة لمنع الآفات:
إبقاء منطقة غسيل الصحون ومصائد الدهون خالية من بقايا الطعام والماء الراكد لتجنب جذب الحشرات والآفات.

${SEP}

Waste Receptacles:
Waste bins must be foot-operated with tight-fitting lids and lined with heavy-duty plastic bags.

Bin Emptying:
Empty waste bins regularly once they reach three-quarters full; wash and sanitize bins daily.

Pest Prevention:
Keep dishwashing areas and grease traps clear of standing water and food debris to avoid attracting pests.`
            },

            /* ---------------------------------------------------------------
               8. سجلات التوثيق + الإشراف
               --------------------------------------------------------------- */
            {
                heading: "8 — سجلات التوثيق والتفتيش اليومي / Documentation and Daily Inspection Logs",
                text: `يلتزم مسؤول الصالة وقائد فريق النظافة بالتحقق اليومي وتعبئة السجلات المعتمدة لدى وزارة الصحة القطرية:
• سجل درجات حرارة غسالة الصحون وأحواض الشطف.
• سجل تركيز المحاليل المطهرة (شرائط الفحص Chemical Test Strips).
• سجل التنظيف والتفريغ اليومي لمصيدة الدهون (Grease Trap Log).
• قائمة التدقيق اليومية لتنظيف وتطهير المطبخ والأرضيات ومنطقة غسيل الصحون.

${SEP}

The Floor Supervisor and Stewarding Team Lead are responsible for daily verification and completing the following MoPH-compliant logs:
• Dishwasher and rinse sink temperature log.
• Sanitizer concentration log (measured via chemical test strips).
• Grease trap cleaning and discharge log.
• Daily kitchen, floor, and dishwashing checklist.`
            },

            {
                heading: "9 — الإشراف والمتابعة المباشرة / Supervision and Direct Oversight",
                text: `يتولى السيد جون نادا والسيد أوما شنكر — بصفتهما مسؤولَي النظافة — تدريب العمال وتطبيق كافة المعايير المذكورة أعلاه في جميع الفروع.

الإشراف والمتابعة: السيد فيكاس.

الدعم التقني والفني: السيد عبد المالك كريم.

مع تحيات إدارة مطعم قيمر وكاهي.

${SEP}

Mr. John Nada and Mr. Uma Shankar, in their capacity as Cleaning Supervisors, are responsible for training the employees and ensuring the implementation of all the standards and procedures mentioned above across all branches.

Supervision and Follow-Up: Mr. Vikas.

Technical and Operational Support: Mr. Abdelmalek Karim.

With the compliments of GAIMER W KAHI Restaurant Management.`
            }
        ];

    // نفس الدليل يُسجَّل للبراندين. sourceFile واحد لأن الملف واحد فعلاً.
    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "GAIMER W KAHI",
        department: "CLEANER",
        sourceFile: "training-content/gaimer-w-kahi-cleaner.js",
        sections: CLEANER_SECTIONS
    });

    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "SHAI BU HAMAD",
        department: "CLEANER",
        sourceFile: "training-content/gaimer-w-kahi-cleaner.js",
        sections: CLEANER_SECTIONS
    });
})();
