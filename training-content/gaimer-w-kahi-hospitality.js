/* =============================================================================
   محتوى التدريب — قيمر وكاهي / قسم الضيافة والاستقبال
   Training Content — Gaimer W Kahi / Hospitality & Reception
   -----------------------------------------------------------------------------
   الفروع: ووك ست وميناء الدوحة القديم — قطر
   إعداد وتطوير: إدارة التشغيل والجودة

   ملاحظات تقنية (اقرأها قبل التعديل):
   - هذا الملف هو المصدر الدائم للمحتوى في المستودع. يُرفع إلى Firestore عبر
     صفحة import-training.html (زر Import) إلى المجموعة training_content
     بمعرّف مستند = GAIMER_W_KAHI__HOSPITALITY.
   - كل عنصر في sections يقابل "قسمًا" واحدًا في محرر لوحة الإدارة، وله:
       heading      : العنوان (عربي — English)
       text         : النص، العربية أولاً ثم خط فاصل ثم الإنجليزية
       imageBase64  : صورة اختيارية (تُضاف لاحقًا من محرر لوحة الإدارة)
   - النص يُعرض كنص خام آمن (escapeHtml) في كيوسك الموظفين — لا تضع وسوم HTML.
     الأسطر الفارغة هي ما يفصل الفقرات ويحدد اتجاه كل فقرة تلقائيًا (dir="auto").
   - يُسجّل نفسه على window حتى يعمل الاستيراد من file:// بدون مشاكل CORS/MIME
     (لا نستخدم fetch لملفات JSON محلية).
   ============================================================================= */

(function () {
    "use strict";

    window.TRAINING_CONTENT_REGISTRY = window.TRAINING_CONTENT_REGISTRY || [];

    var SEP = "———————————————";

    window.TRAINING_CONTENT_REGISTRY.push({
        restaurant: "GAIMER W KAHI",
        department: "HOSPITALITY",
        sourceFile: "training-content/gaimer-w-kahi-hospitality.js",
        sections: [

            /* ---------------------------------------------------------------
               مقدمة الدليل
               --------------------------------------------------------------- */
            {
                heading: "مقدمة الدليل التدريبي — Introduction to the Training Guide",
                text: `البرنامج التدريبي الشامل لمعايير الخدمة والتقديم الاحترافي

إعداد وتطوير: إدارة التشغيل والجودة
الفروع: فرع ووك ست وميناء الدوحة القديم — قطر

يسر إدارة التشغيل والجودة لفرع «ووك ست» و«قِيمر وكاهي» أن تضع بين أيديكم هذا الدليل التدريبي الشامل، والذي أُعد ليكون المرجع الأساسي لكافة كوادر الخدمة والضيافة، بهدف ضمان أعلى معايير الخدمة الخليجية الأصيلة.

يهدف هذا الدليل إلى توحيد إجراءات التعامل مع الضيوف، بدءًا من لحظة الاستقبال والترحيب، مرورًا بتقديم المشروبات والأطباق وتدوين الطلبات بدقة، وصولًا إلى المحافظة على أعلى مستويات النظافة والانضباط التشغيلي.

إن التزامنا بتطبيق هذه المعايير يعكس هوية «قِيمر وكاهي»، ويضمن تقديم تجربة استثنائية لضيوفنا تعتمد على الجودة والسرعة والكفاءة والاحترافية.

ولضمان متابعة وتنفيذ هذه البروتوكولات، يتولى مشرفو الصالة مسؤولية تدريب وتطوير فريق العمل في مجالات اختصاصهم، بما يضمن رفع كفاءة الأداء وتعزيز روح الفريق الواحد.

${SEP}

Comprehensive Training Program for Service Standards and Professional Presentation

Prepared and developed by: Operations and Quality Management
Branches: West Walk and Old Doha Port — Qatar

The Operations and Quality Management of the "West Walk" branch and "Gaimer W Kahi" is pleased to present this comprehensive training guide, prepared to serve as the primary reference for all service and hospitality staff, with the aim of guaranteeing the highest standards of authentic Gulf service.

This guide aims to standardize all guest-handling procedures — from the moment of reception and welcome, through serving beverages and dishes and recording orders accurately, all the way to maintaining the highest levels of cleanliness and operational discipline.

Our commitment to applying these standards reflects the identity of "Gaimer W Kahi" and ensures an exceptional guest experience built on quality, speed, efficiency and professionalism.

To ensure these protocols are followed and implemented, the floor supervisors are responsible for training and developing the team within their areas of specialization, so as to raise performance standards and strengthen the spirit of one team.`
            },

            /* ---------------------------------------------------------------
               المحور الأول: بروتوكول استقبال الضيوف وإدارة الخدمة
               --------------------------------------------------------------- */
            {
                heading: "المحور الأول (1) — الاستقبال والترحيب وإجلاس الضيف / Reception, Welcoming and Seating the Guest",
                text: `الترحيب الدافئ بالزبون فور وصوله، مع الابتسامة المباشرة واستخدام عبارات راقية وموحدة.

توجيه الزبون إلى الطاولة المناسبة ومساعدته على الجلوس.

تقديم قائمة الطعام للزبون فور جلوسه.

${SEP}

Give the guest a warm welcome the moment they arrive, with a direct smile and refined, standardized greeting phrases.

Guide the guest to the appropriate table and assist them in taking their seat.

Present the menu to the guest as soon as they are seated.`
            },

            {
                heading: "المحور الأول (2) — تدوين الطلب وأصول التعامل / Taking the Order and Proper Conduct",
                text: `عند أخذ الطلب من الزبون، يجب الالتزام بالخطوات التالية:

كتابة الطلب كاملًا على ورقة الطلبات.

تدوين رقم الطاولة وعدد الأشخاص واسم الموظف.

تسجيل كل صنف يطلبه الزبون بوضوح، مع تدوين جميع تفضيلاته وملاحظاته الخاصة.

توضيح الوقت المتوقع لتحضير الأطباق وإيصال الطلب إلى الزبون.

إبلاغ الزبون بأن بعض الأطباق تحتاج إلى وقت محدد للتحضير، مثل:
• المشروبات: من 3 إلى 5 دقائق.
• الأطباق الخفيفة والفطور: من 10 إلى 15 دقيقة.
• الأطباق الرئيسية والمشاوي: من 15 إلى 20 دقيقة.

${SEP}

When taking an order from a guest, the following steps must be followed:

Write the full order on the order pad.

Record the table number, the number of guests, and the staff member's name.

Record every item the guest orders clearly, together with all of their preferences and special notes.

Explain the expected preparation time for the dishes and when the order will reach the guest.

Inform the guest that some dishes require a specific preparation time, for example:
• Beverages: 3 to 5 minutes.
• Light dishes and breakfast: 10 to 15 minutes.
• Main dishes and grills: 15 to 20 minutes.`
            },

            {
                heading: "المحور الأول (3) — سؤال الزبون عن توقيت تقديم المشروب / Asking the Guest When to Serve the Beverage",
                text: `يجب سؤال الزبون بوضوح:

هل تفضل تقديم المشروب، مثل الماء أو العصائر أو الكرك أو الشاي، قبل الأكل مباشرة، أم مع وجبة الطعام، أم بعد الانتهاء من الأكل؟

يجب تسجيل ملاحظة واضحة على ورقة الطلب وفي النظام، مثل:
• تقديم المشروب قبل الأكل.
• تقديم المشروب مع الأكل.
• تقديم المشروب بعد الأكل.

${SEP}

The guest must be asked clearly:

Would you prefer your beverage — such as water, juice, karak or tea — to be served immediately before the meal, together with the meal, or after finishing the meal?

A clear note must be recorded on the order pad and in the system, for example:
• Serve the beverage before the meal.
• Serve the beverage with the meal.
• Serve the beverage after the meal.`
            },

            {
                heading: "المحور الأول (4) — إعادة قراءة الطلب للزبون / Reading the Order Back to the Guest",
                text: `بعد الانتهاء من تدوين الطلب، يقوم الموظف بإعادة قراءة الطلب كاملًا على الزبون بصوت واضح وهادئ، مع التأكد من:
• الأطباق المطلوبة.
• المشروبات المطلوبة.
• الإضافات والتعديلات.
• الملاحظات الخاصة.

ويهدف ذلك إلى منع الأخطاء في الطلبات، والتأكد من رضا الزبون، وتقليل الهدر في المطبخ والبار.

${SEP}

After finishing writing the order, the staff member reads the entire order back to the guest in a clear, calm voice, confirming:
• The dishes ordered.
• The beverages ordered.
• Any add-ons and modifications.
• Any special notes.

The purpose of this is to prevent order errors, confirm guest satisfaction, and reduce waste in the kitchen and the bar.`
            },

            {
                heading: "المحور الأول (5) — إدخال الطلب وتنفيذه / Entering and Executing the Order",
                text: `إدخال الطلب فورًا في نظام نقاط البيع (POS).

متابعة خروج المشروبات والأطباق حسب التوقيت المحدد في الطلب.

التأكد من تقديم المشروب أو الطبق في الوقت الذي حدده الزبون.

${SEP}

Enter the order into the Point of Sale (POS) system immediately.

Follow up on the release of beverages and dishes according to the timing specified in the order.

Make sure the beverage or dish is served at exactly the time the guest requested.`
            },

            /* ---------------------------------------------------------------
               المحور الثاني: الإتيكيت العام
               --------------------------------------------------------------- */
            {
                heading: "المحور الثاني — الإتيكيت العام لتقديم الأطعمة والمشروبات / General Etiquette for Serving Food and Beverages",
                text: `قواعد تقديم الأطباق:

تقديم الأطباق الرئيسية والمقبلات من الجهة اليسرى للضيف، باستخدام اليد اليسرى.

رفع الأطباق والمعدات المستخدمة من الجهة اليمنى، باستخدام اليد اليمنى.

تقديم المشروبات والماء من الجهة اليمنى للضيف.

التأكد من أن شعار العلامة التجارية الموجود على الكوب أو الزجاجة يواجه الضيف مباشرة.

عدم لمس الحواف العلوية للكؤوس أو الأكواب.

حمل الأطباق من الأطراف وعدم إدخال اليد داخل إطار الصحن.

المحافظة على مسافة مناسبة أثناء التقديم، مع الابتسامة والتواصل البصري.

شرح مكونات الطبق للضيف عند الحاجة بطريقة واضحة ولطيفة.

${SEP}

Rules for serving dishes:

Serve main dishes and appetizers from the guest's left side, using the left hand.

Clear used plates and equipment from the guest's right side, using the right hand.

Serve beverages and water from the guest's right side.

Make sure the brand logo on the cup or bottle faces the guest directly.

Never touch the upper rims of glasses or cups.

Carry plates by their edges; never place your hand inside the rim of the plate.

Maintain an appropriate distance while serving, with a smile and eye contact.

Explain the components of the dish to the guest when needed, in a clear and courteous manner.`
            },

            /* ---------------------------------------------------------------
               المحور الثالث: المقبلات والسلطات
               --------------------------------------------------------------- */
            {
                heading: "المحور الثالث (1) — المقبلات المشكلة / Mixed Appetizers (Mezze Platter)",
                text: `تُقدّم كطبق مشاركة في منتصف الطاولة، وتكفي من شخصين إلى ثلاثة أشخاص، وتشمل:
• تبولة.
• حمص.
• سلطة مشوية.
• متبل باذنجان.
• ذرة.
• جرجير.
• زيتون حار.
• سلطة خاصة.

يجب مراجعة مكونات المقبلات وشرحها للضيف بصوت واضح.

${SEP}

Served as a sharing platter in the center of the table, sufficient for two to three people, and includes:
• Tabbouleh.
• Hummus.
• Grilled salad.
• Eggplant mutabbal.
• Corn.
• Rocket (arugula).
• Spicy olives.
• House special salad.

The components of the platter must be reviewed and explained to the guest in a clear voice.`
            },

            {
                heading: "المحور الثالث (2) — السلطات / Salads",
                text: `سلطة الحديقة العراقية:
تُقدّم طازجة مع توضيح مكوناتها المميزة، مثل: الصلصة الخاصة، الطماطم، البصل، الذرة، الصنوبر، الريحان، الفلفل.

سلطة التبولة:
تُقدّم باردة جدًا، مع إبراز الخضار المقطعة وشرائح الليمون والبقدونس.

سلطة الجرجير:
تُقدّم لشخص واحد، مع البصل والطماطم الكرزية والسماق وشرائح الليمون، ويُقدّم معها صوص الليمون.

سلطة الشمندر:
تُقدّم باردة، مع وضع الشوكة والسكين للضيف.

${SEP}

Iraqi Garden Salad:
Served fresh, with its distinctive components explained: house dressing, tomato, onion, corn, pine nuts, basil and pepper.

Tabbouleh Salad:
Served very cold, highlighting the finely chopped vegetables, lemon slices and parsley.

Rocket (Arugula) Salad:
Served as a single portion, with onion, cherry tomatoes, sumac and lemon slices, accompanied by lemon dressing.

Beetroot Salad:
Served cold, with a fork and knife set for the guest.`
            },

            {
                heading: "المحور الثالث (3) — الحمص والمتبل والمخللات / Hummus, Mutabbal and Pickles",
                text: `حمص بطحينة:
يُقدّم لشخص أو شخصين، ويُزيّن بزيت الزيتون والنعناع.

متبل عراقي خاص:
يتم شرح طبيعة الطبق ومكوناته للضيف، مثل البصل والطماطم والسمكة الحارة والطحينية.

متبل باذنجان:
يُقدّم بقوام متجانس ومزيّن بطريقة جذابة، ويكفي لشخص أو شخصين.

طرشي عراقي:
يُقدّم كمخللات باردة وطبق جانبي افتتاحي للوجبة.

${SEP}

Hummus with Tahini:
Served for one to two people, garnished with olive oil and mint.

Special Iraqi Mutabbal:
The nature of the dish and its components are explained to the guest — onion, tomato, spicy fish and tahini.

Eggplant Mutabbal:
Served with a smooth, even texture and an attractive garnish; sufficient for one to two people.

Iraqi Torshi (Pickles):
Served cold as a pickled side dish to open the meal.`
            },

            {
                heading: "المحور الثالث (4) — المقبلات الساخنة / Hot Appetizers",
                text: `شوربة العدس:
تُقدّم ساخنة جدًا في وعاء عميق، مع ملعقة وشريحة ليمون وخبز محمص على الجانب.

عروق طاوة:
تُقدّم ساخنة فور خروجها من القلي، مع توضيح مكوناتها من اللحم المفروم والتوابل والأعشاب، وتكفي لشخص أو شخصين.

تسالي لبلي:
تُقدّم ساخنة في وعاء عميق مع البهارات العراقية والفواكه المجففة، وتكفي لشخص واحد.

تسالي قلاية:
يُقدّم الفول المسلوق المتبل ساخنًا مع البهارات العراقية، ويكفي لشخص واحد.

سبيرنق رول عراقي:
يُقدّم ساخنًا ومقرمشًا، ويتكون من أربع قطع، مع التأكد من نوع الحشوة المختارة، مثل: السبانخ، الجبن، اللحم.

سمبوسة مشكلة:
تُقدّم خمس حبات ساخنة ومرتبة بشكل جذاب، مع إمكانية اختيار الحشوة، مثل: اللحم، الجبن، السبانخ، الكيري.

${SEP}

Lentil Soup:
Served very hot in a deep bowl, with a spoon, a lemon slice and toasted bread on the side.

Uruq Tawa:
Served hot straight out of the fryer, explaining its components of minced meat, spices and herbs; sufficient for one to two people.

Tasali Lablabi:
Served hot in a deep bowl with Iraqi spices and dried fruit; a single portion.

Tasali Qalaya:
Seasoned boiled fava beans served hot with Iraqi spices; a single portion.

Iraqi Spring Rolls:
Served hot and crispy, four pieces, after confirming the chosen filling: spinach, cheese or meat.

Mixed Sambousa:
Five pieces served hot and arranged attractively, with a choice of filling: meat, cheese, spinach or Kiri cheese.`
            },

            {
                heading: "المحور الثالث (5) — أطباق الكبة / Kubba Dishes",
                text: `طبق كبة برغل:
تُقدّم ساخنة مع حشوة اللحم البقري المفروم والبهارات.

طبق كبة حلب:
تُقدّم كرات ذهبية محشوة باللحم والمكسرات واللوز والبهارات العراقية.

طبق كبة البطاطا:
تُقدّم مع البطاطا المهروسة المقرمشة من الخارج والمحشوة باللحم المفروم.

${SEP}

Bulgur Kubba:
Served hot with a filling of minced beef and spices.

Kubba Halab:
Served as golden balls stuffed with meat, nuts, almonds and Iraqi spices.

Potato Kubba:
Served as mashed potato, crispy on the outside and stuffed with minced meat.`
            },

            {
                heading: "المحور الثالث (6) — المقليات / Fried Dishes",
                text: `بطاطا مقلية مع جبن:
تُقدّم البطاطا ساخنة فور القلي، مع توزيع الجبن الساخن عليها، وتكفي لشخص أو شخصين.

طبق بطاطا مقلية أو باذنجان مقلي:
يجب تقديم الأطباق المقلية بشكل مقرمش والتأكد من خلوها من الزيوت الزائدة.

${SEP}

French Fries with Cheese:
The fries are served hot immediately after frying, with hot cheese distributed over them; sufficient for one to two people.

French Fries or Fried Eggplant:
Fried dishes must be served crispy, and must be checked to ensure they are free of excess oil.`
            },

            /* ---------------------------------------------------------------
               المحور الثالث: الأطباق الرئيسية
               --------------------------------------------------------------- */
            {
                heading: "المحور الثالث (7) — قوزي لحم خروف وقص عراقي / Quzi Lamb and Iraqi Gus",
                text: `قوزي لحم خروف:
يُقدّم بأسلوب فاخر مع شرح الطبق للضيف، ويتكون من كتف خروف مطهو بعناية لمدة خمس ساعات، ويُقدّم مع:
• الأرز الأبيض المنثور.
• الصلصة الخاصة.
• التوابل والنكهات الخاصة بالمطعم.

قص عراقي:
يُقدّم بشكل استعراضي جذاب مع نوعين من الأرز والبطاطا المقلية والسلطة الحارة والصلصة المرافقة.

${SEP}

Quzi (Lamb Shoulder):
Served in a luxurious style with the dish explained to the guest. It consists of a lamb shoulder carefully slow-cooked for five hours, served with:
• Fluffy white rice.
• The house special sauce.
• The restaurant's signature spices and flavors.

Iraqi Gus:
Presented in an attractive, showpiece style with two kinds of rice, french fries, spicy salad and the accompanying sauce.`
            },

            {
                heading: "المحور الثالث (8) — بدوي دجاج وبدوي لحم / Badawi Chicken and Badawi Lamb",
                text: `بدوي دجاج:
يجب إبلاغ الضيف مسبقًا بأن وقت التحضير يتراوح من 20 إلى 30 دقيقة. يُقدّم الطبق ساخنًا مع:
• الأرز الأبيض.
• ربع الدجاجة.
• البهارات الخاصة.
• الروب.
• الصوص الأحمر الخاص.

بدوي لحم:
يُقدّم الأرز الأبيض الساخن مع قطعة من لحم الخروف الطري والروب والصوص الأحمر الخاص.

${SEP}

Badawi Chicken:
The guest must be informed in advance that preparation takes 20 to 30 minutes. The dish is served hot with:
• White rice.
• A quarter chicken.
• The special spice blend.
• Rawb (Iraqi yogurt).
• The special red sauce.

Badawi Lamb:
Hot white rice served with a piece of tender lamb, rawb (Iraqi yogurt) and the special red sauce.`
            },

            {
                heading: "المحور الثالث (9) — الدولمة العراقية / Iraqi Dolma",
                text: `دولمة عراقية:
تُقدّم ساخنة مع الخضار واللحم والأرز، وتُزيّن بحبتين من الريش، وتكفي من شخصين إلى ثلاثة أشخاص.

دولمة عراقية بالدجاج:
تُقدّم مع نصف دجاجة محمرة، والأرز والخضار المحشوة، وتكفي من شخصين إلى ثلاثة أشخاص.

${SEP}

Iraqi Dolma:
Served hot with vegetables, meat and rice, garnished with two lamb chops; sufficient for two to three people.

Iraqi Dolma with Chicken:
Served with half a roasted chicken, rice and stuffed vegetables; sufficient for two to three people.`
            },

            {
                heading: "المحور الثالث (10) — الصينية البغدادية / The Baghdadi Platter",
                text: `تُقدّم في صينية كبيرة في وسط الطاولة، مع شرح المكونات المتنوعة، وتشمل:
• كبة بطاطا: قطعتان.
• كبة برغل: قطعتان.
• كبة حلب: قطعتان.
• عروق طاوة: خمس قطع.
• كباب لحم: ثلاث قطع.
• خبز عراقي.
• طرشي.
• لبن عراقي طازج يُصب من الجار المرفق.

${SEP}

Served on a large tray in the center of the table, with all of its varied components explained. It includes:
• Potato kubba: 2 pieces.
• Bulgur kubba: 2 pieces.
• Kubba Halab: 2 pieces.
• Uruq Tawa: 5 pieces.
• Lamb kebab: 3 pieces.
• Iraqi bread.
• Torshi (pickles).
• Fresh Iraqi laban, poured from the accompanying jar.`
            },

            {
                heading: "المحور الثالث (11) — الحمسة على الفخارة / Hamsa in the Clay Pot (Fakhara)",
                text: `حمسة دجاج على الفخارة:
تُقدّم في الفخارة الساخنة جدًا، مع رفع الغطاء أمام الضيف بحذر للسماح بخروج البخار والروائح. وتشمل أنواع الأرز المرافقة:
• أرز أبيض.
• أرز أحمر.
• أرز قلي.
• أرز شبت.

حمسة دجاج مشروم بالفخارة:
تُرفع عجينة الكاهي المغطاة عن الفخارة بأسلوب احترافي لإبراز رائحة الطبخ، ويُقدّم الطبق مع الدجاج والمشروم وزيت الترافل، ويكفي لشخص أو شخصين.

${SEP}

Chicken Hamsa in the Clay Pot:
Served in a very hot clay pot, lifting the lid carefully in front of the guest to release the steam and aromas. The accompanying rice options include:
• White rice.
• Red rice.
• Qali rice.
• Dill rice.

Chicken and Mushroom Hamsa in the Clay Pot:
The kahi dough covering the clay pot is lifted professionally to release the cooking aroma. The dish is served with chicken, mushroom and truffle oil; sufficient for one to two people.`
            },

            {
                heading: "المحور الثالث (12) — المقلوبة ومعكرونة أهلنا / Maqluba and Ahalna Pasta",
                text: `مقلوبة دجاج:
يتم شرح مكونات الطبق، مثل: الدجاج، الأرز، الباذنجان، البطاطا، الطماطم، الفلفل. وتُقدّم مع اللبن الزبادي على الجانب، وتكفي لشخص أو شخصين.

معكرونة أهلنا:
يجب الإشارة إلى توفر الطبق بعد الساعة 12 ظهرًا، ويُقدّم في وعاء واسع مع اللحم المفروم والصلصة الحمراء، ويكفي لشخص أو شخصين.

${SEP}

Chicken Maqluba:
The components of the dish are explained: chicken, rice, eggplant, potato, tomato and pepper. Served with yogurt on the side; sufficient for one to two people.

Ahalna Pasta:
The guest must be told that this dish is available after 12:00 noon. Served in a wide bowl with minced meat and red sauce; sufficient for one to two people.`
            },

            {
                heading: "المحور الثالث (13) — صينية تيبسي والنواشف العراقية / Tepsi Tray and Iraqi Nawashef",
                text: `صينية تيبسي بكبة اللحم:
تُقدّم ساخنة في الصينية، وتتكون من الباذنجان والكبة واللحم المتبل، وتكفي لشخص أو شخصين.

صينية تيبسي مع الدجاج:
تُقدّم مع الدجاج المخبوز في الفرن والباذنجان المطبوخ، وتكفي لشخص أو شخصين.

نواشف عراقية:
تُقدّم تشكيلة من المقبلات المقرمشة والساخنة، مثل: البطاطا، الباذنجان، الكبة، كبة البطاطا، عروق الطاوة، كباب اللحم، الأرز. وتكفي من شخصين إلى ثلاثة أشخاص.

${SEP}

Tepsi Tray with Meat Kubba:
Served hot in the tray, consisting of eggplant, kubba and seasoned meat; sufficient for one to two people.

Tepsi Tray with Chicken:
Served with oven-baked chicken and cooked eggplant; sufficient for one to two people.

Iraqi Nawashef:
An assortment of hot, crispy appetizers served together: potato, eggplant, kubba, potato kubba, Uruq Tawa, lamb kebab and rice. Sufficient for two to three people.`
            },

            {
                heading: "المحور الثالث (14) — أطباق الأرز / Rice Dishes",
                text: `يمكن تقديم أنواع مختلفة من الأرز، مثل:
• تمن جله.
• تمن أحمر.
• تمن كبسة.
• تمن أبيض.
• تمن قلي.

يجب تعريف الضيف بنوع الأرز المقدم.

${SEP}

Several different types of rice may be served, such as:
• Timman Jalla.
• Red timman.
• Kabsa timman.
• White timman.
• Qali timman.

The guest must always be told which type of rice is being served.`
            },

            {
                heading: "المحور الثالث (15) — البرجر والبيتزا والصفيحة / Burger, Pizza and Sfeeha",
                text: `برجر عراقي:
يُقدّم طازجًا بعد الساعة 12 ظهرًا، مع:
• اللحم أو الدجاج.
• الطماطم.
• الخس.
• الطرشي.
• الصلصة الخاصة بالطبق.

بيتزا كاهي:
تُقدّم على قطعة الكاهي، وتكون ساخنة ومرفوعة على حامل دافئ. ويمكن اختيارها مع: الدجاج، الخضار، الجبن.

صفيحة الكاهي الضخمة:
تُقدّم دافئة ومقرمشة، مع إمكانية اختيار الحشوة، مثل: الجبن، الزعتر.

${SEP}

Iraqi Burger:
Served fresh after 12:00 noon, with:
• Beef or chicken.
• Tomato.
• Lettuce.
• Torshi (pickles).
• The dish's special sauce.

Kahi Pizza:
Served on a piece of kahi, hot and raised on a warm stand. Available with a choice of: chicken, vegetables or cheese.

Giant Kahi Sfeeha:
Served warm and crispy, with a choice of filling: cheese or zaatar.`
            },

            {
                heading: "المحور الثالث (16) — المشاوي العراقية / Iraqi Grills",
                text: `تُقدّم المشاوي العراقية ابتداءً من الساعة 12 ظهرًا، وتشمل:

ريش مشوية:
تُقدّم أربع قطع ساخنة على الفحم، مع البطاطا المقلية والسلطة الطازجة.

كبسة قيمر وكاهي الخاصة مع الدجاج المشوي:
يُقدّم الدجاج المشوي فوق الأرز المتبل بالخلطة الخاصة، مع تقديم الروب الخاص على الجانب.

كباب عراقي:
تُقدّم أربعة أسياخ من كباب الدجاج أو اللحم على الفحم مباشرة، مع الخبز العراقي والبطاطا والسلطة.

تكة لحم أو دجاج:
تُقدّم أربعة أسياخ دجاج أو ثلاثة أسياخ لحم طازجة، مع السلطة والبطاطا المقلية.

${SEP}

Iraqi grills are served starting from 12:00 noon, and include:

Grilled Lamb Chops:
Four pieces served hot off the charcoal, with french fries and fresh salad.

Gaimer W Kahi Special Kabsa with Grilled Chicken:
Grilled chicken served over rice seasoned with the house special blend, with the special rawb (yogurt) on the side.

Iraqi Kebab:
Four skewers of chicken or lamb kebab served straight off the charcoal, with Iraqi bread, potatoes and salad.

Lamb or Chicken Tikka:
Four fresh chicken skewers or three lamb skewers, served with salad and french fries.`
            },

            {
                heading: "المحور الثالث (17) — المشاوي العراقية المشكلة / Iraqi Mixed Grill",
                text: `تتوفر بأحجام مختلفة:
• صغير.
• وسط.
• كامل.

ويجب شرح المكونات للضيف، مثل:
• 3 أسياخ كباب لحم.
• 3 أسياخ كباب دجاج.
• 2 أسياخ تكة لحم.
• 3 قطع تكة دجاج.
• قطع ريش.
• بطاطا.

كما يجب سؤال الضيف عن نوع الأرز المفضل، مثل:
• الأرز الأحمر.
• أرز الكبسة.
• أرز القلي.
• الأرز الأبيض.
• الأرز الخاص.

ويُقدّم المشكل العراقي مع اللبن العراقي والروب الخاص حسب الاختيار، مع التأكد من توفير نوع الأرز المفضل على الطاولة فورًا.

${SEP}

Available in different sizes:
• Small.
• Medium.
• Full.

The components must be explained to the guest, for example:
• 3 lamb kebab skewers.
• 3 chicken kebab skewers.
• 2 lamb tikka skewers.
• 3 pieces of chicken tikka.
• Lamb chop pieces.
• Potatoes.

The guest must also be asked which rice they prefer, such as:
• Red rice.
• Kabsa rice.
• Qali rice.
• White rice.
• House special rice.

The Iraqi mixed grill is served with Iraqi laban and the special rawb according to the guest's choice, making sure the preferred type of rice is brought to the table immediately.`
            },

            {
                heading: "المحور الثالث (18) — البوكسات وصواني العزائم / Boxes and Banquet Trays",
                text: `بوكس فطاير كاهي:
يتكون من 10 قطع مشكلة، مع توضيح الأنواع للضيف، مثل:
• كاهي سبانخ.
• كاهي زعتر.
• كاهي لحم.
• كاهي أجبان مشكلة.
• كاهي موزاريلا.
• كاهي عكاوي.
ويكفي من ثلاثة إلى أربعة أشخاص.

بوكس كنافة مشكلة:
يتكون من 15 قطعة، مع تشكيلة متنوعة من النكهات، مثل:
• قيمر.
• مكسرات.
• لوز.
• فستق.
• كاجو.
• نوتيلا.
• صوص كيري.
ويجب سؤال الضيف عن الصوص المفضل، مثل العسل أو الشيرة، ويكفي من ثلاثة إلى أربعة أشخاص.

صواني العزائم:
تُقدّم الصواني الكبيرة في وسط الطاولة أو الصالة بأسلوب استعراضي، مع إبراز ألوان الأرز الأربعة:
• الأرز الأبيض.
• الأرز الأحمر.
• أرز الكبسة.
• أرز القلي.
وتشمل الصواني المشاوي والدجاج والمقبلات والأطباق المرافقة، بما يعكس أعلى درجات الضيافة والكرم العراقي.

${SEP}

Kahi Pastry Box:
Contains 10 mixed pieces, with the varieties explained to the guest:
• Spinach kahi.
• Zaatar kahi.
• Meat kahi.
• Mixed cheese kahi.
• Mozzarella kahi.
• Akkawi cheese kahi.
Sufficient for three to four people.

Mixed Kunafa Box:
Contains 15 pieces with a varied selection of flavors:
• Gaimer (clotted cream).
• Mixed nuts.
• Almond.
• Pistachio.
• Cashew.
• Nutella.
• Kiri cheese sauce.
The guest must be asked which sauce they prefer, such as honey or sugar syrup. Sufficient for three to four people.

Banquet Trays:
The large trays are presented in the center of the table or the hall in a showpiece style, highlighting the four rice colors:
• White rice.
• Red rice.
• Kabsa rice.
• Qali rice.
The trays include grills, chicken, appetizers and accompanying dishes, reflecting the highest degree of Iraqi hospitality and generosity.`
            },

            /* ---------------------------------------------------------------
               المحور الرابع: المشروبات
               --------------------------------------------------------------- */
            {
                heading: "المحور الرابع (1) — المشروبات الغازية والعصائر / Soft Drinks and Juices",
                text: `تقديم كوب مملوء بالثلج لشخص واحد أولًا.

صب المشروب أمام الضيف ببطء حتى لا يفقد الفوران.

وضع الكأس بجانب الزجاجة أو العلبة.

توجيه شعار العلامة التجارية نحو الضيف.

تجنب ملء الكأس بشكل زائد.

${SEP}

First present a glass filled with ice for one person.

Pour the drink slowly in front of the guest so that it does not lose its fizz.

Place the glass next to the bottle or can.

Turn the brand logo to face the guest.

Avoid overfilling the glass.`
            },

            {
                heading: "المحور الرابع (2) — تقديم الماء / Serving Water",
                text: `تقديم كاسات ماء نظيفة وجافة.

سكب الماء من الجهة اليمنى للضيف.

ملء الكأس حتى ثلثيه.

عدم ملامسة فوهة الزجاجة لحافة الكأس.

سؤال الزبون فور جلوسه عما إذا كان يحتاج إلى الماء.

${SEP}

Present clean, dry water glasses.

Pour the water from the guest's right side.

Fill the glass to two thirds.

Never let the mouth of the bottle touch the rim of the glass.

Ask the guest as soon as they are seated whether they would like water.`
            },

            {
                heading: "المحور الرابع (3) — تقديم استكانة الشاي العراقي / Serving the Iraqi Tea Istikana",
                text: `تقديم الشاي ساخنًا جدًا وبطريقة نظيفة.

وضع الاستكانة على صحن صغير نظيف.

وضع ملعقة الشاي الصغيرة إلى جانب الاستكانة.

تقديم السكر على الجانب.

التأكد من عدم وجود أي انسكاب خارجي.

${SEP}

Serve the tea very hot and in a clean manner.

Place the istikana (traditional tea glass) on a clean small saucer.

Place the small teaspoon beside the istikana.

Serve the sugar on the side.

Make sure there are no spills on the outside of the glass or saucer.`
            },

            /* ---------------------------------------------------------------
               المحور الخامس: فريق التدريب
               --------------------------------------------------------------- */
            {
                heading: "المحور الخامس — فريق التدريب وتوزيع المسؤوليات التشغيلية / Training Team and Distribution of Operational Responsibilities",
                text: `السيد حمزة زريب — مسؤول صالة:
يتولى الإشراف الكامل على تدريب فريق العمل في كل ما يتعلق بـ:
• خدمة الطاولات.
• قواعد الإتيكيت.
• تقديم الوجبات والمشروبات.
• ضمان الدقة والسرعة والاحترافية المطلوبة.

السيد رضوان برقوقي — مسؤول صالة:
يتولى الإشراف والمتابعة المباشرة لتدريب الموظفين على معايير النظافة، ويشمل ذلك:
• النظافة الشخصية.
• نظافة الصالة والمكان.
• تطبيق جميع الاشتراطات الصحية والبيئية في صالة الخدمة.

السيد محمد الورداني — مسؤول صالة:
يتولى الإشراف على تدريب الموظفين في بروتوكول استقبال الزبائن، ويشمل ذلك:
• الترحيب الدافئ.
• إجلاس الضيوف.
• إدارة التجربة الأولى للزبون فور دخوله المطعم.

${SEP}

Mr. Hamza Zrib — Floor Supervisor:
Holds full responsibility for supervising the training of the team in everything related to:
• Table service.
• Etiquette rules.
• Serving meals and beverages.
• Ensuring the required accuracy, speed and professionalism.

Mr. Radhouene Bargougi — Floor Supervisor:
Holds direct responsibility for supervising and following up on staff training in cleanliness standards, including:
• Personal hygiene.
• Cleanliness of the hall and the premises.
• Applying all health and environmental requirements in the service hall.

Mr. Mohamed Al Ouerdani — Floor Supervisor:
Holds responsibility for supervising staff training in the guest reception protocol, including:
• The warm welcome.
• Seating the guests.
• Managing the guest's first experience the moment they enter the restaurant.`
            }
        ]
    });
})();
