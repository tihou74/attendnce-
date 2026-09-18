/* =============================================================================
   Service Worker — نظام الحضور والرواتب، مجموعة الشيخة
   -----------------------------------------------------------------------------
   الغرض الأول من هذا الملف هو جعل الصفحات قابلة للتثبيت كتطبيق (PWA)، والغرض
   الثاني أن تفتح الشاشة حتى مع انقطاع الشبكة بدل صفحة خطأ المتصفح.

   ⚠️ قاعدة حاكمة: مِيزة «الموقع يحدّث نفسه تلقائيًا» هي ما أنهى نسخ الملفات
   يدويًا. لذلك ملفات HTML تُجلب من **الشبكة أولًا** دائمًا، ولا تُخزَّن نسخة
   مؤقتة تُقدَّم قبل الشبكة. لو استُخدمت سياسة «الكاش أولًا» على HTML لظل المدير
   يرى نسخة قديمة من التطبيق بعد كل تحديث — وهذا أسوأ من عدم وجود PWA أصلًا.

   السياسات:
   - HTML / التنقّل        → الشبكة أولًا، والكاش احتياطي عند انقطاع الشبكة فقط.
   - الأيقونات والصور      → الكاش أولًا مع تحديث صامت في الخلفية (لا تتغير كثيرًا).
   - سكربتات CDN مثبّتة    → الكاش أولًا (الرابط يحمل رقم الإصدار فالمحتوى ثابت).
   - أي طلب إلى Firebase   → **يُترك للشبكة بلا اعتراض إطلاقًا**. اعتراضه يفسد
     الاتصال المستمر (long-polling) الذي يستخدمه Firestore، وقد يُخزّن ردود
     مصادقة وهو ما لا يجوز أمنيًا.
   - أي طلب غير GET        → لا يُعترَض (الكتابة والمصادقة).

   عند أي تعديل على منطق التخزين: ارفع CACHE_VERSION ليُحذف الكاش القديم.
   ============================================================================= */

'use strict';

// v4: أُلزم جلب HTML بالتحقق من الخادم (no-cache) لأن كاش المتصفح كان يُخفي
// تبويبًا جديدًا بعد نشره. v3: أُزيل التحويل التلقائي من report.html (كان يُبطل تثبيت تطبيق المديرين على
// iOS)، ويجب إبطال
// الكاش القديم حتى لا يبقى من ثبّت التطبيق سابقًا على النسخة القديمة.
const CACHE_VERSION = 'v102';
const SHELL_CACHE = `alsheikha-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `alsheikha-assets-${CACHE_VERSION}`;

// نسخة احتياطية تُقدَّم فقط إذا كانت الشبكة مقطوعة.
const SHELL_FILES = [
    './',
    './index.html',
    './admin.html',
    './report.html',
    './balances.html',
    './manager.html',
    './abaya-seller.html',
    './abaya-balances.html',
    './manifest.json',
    './manifest-report.json',
    './manifest-admin.json',
    './manifest-balances.json',
    './manifest-abaya.json',
    './manifest-abaya-view.json',
    // ورقة الهوية البصرية: تُخزَّن مع القشرة لا عند أول طلب، وإلا فُتحت الصفحة
    // بلا أي تنسيق في أول تشغيل بلا شبكة. الخط نفسه من نطاق جوجل ويُخزَّن
    // بقاعدة CACHEABLE_HOSTS، والنظام يستخدم خطه الاحتياطي لو تعذّر.
    './brand/design-tokens.css',
    // أيقونة مميّزة لكل تطبيق. كانت الأربعة تتشارك icon-192.png فظهرت متشابهة
    // على شاشة الهاتف ولم يعرف المستخدم أيّها يفتح. الملفات القديمة تُركت في
    // المستودع لمن ثبّت التطبيق قبل التغيير، لكنها لم تبقَ مرجعًا لأي صفحة.
    './icons/attendance-192.png',
    './icons/attendance-512.png',
    './icons/attendance-maskable-512.png',
    './icons/attendance-touch.png',
    './icons/report-192.png',
    './icons/report-512.png',
    './icons/report-maskable-512.png',
    './icons/report-touch.png',
    './icons/admin-192.png',
    './icons/admin-512.png',
    './icons/admin-maskable-512.png',
    './icons/admin-touch.png',
    './icons/balances-192.png',
    './icons/balances-512.png',
    './icons/balances-maskable-512.png',
    './icons/balances-touch.png',
    // ⚠️ أيقونات العبايات كانت غائبة عن هذه القائمة كليًّا، مع أن الصفحتين
    // والبيانين يُشيرون إليها — فكانت تُطلب من الشبكة في كل مرة، ولا تظهر
    // إطلاقًا في أول تشغيل بلا إنترنت.
    './icons/abaya-192.png',
    './icons/abaya-512.png',
    './icons/abaya-maskable-512.png',
    './icons/abaya-touch.png',
    './icons/abayaview-192.png',
    './icons/abayaview-512.png',
    './icons/abayaview-maskable-512.png',
    './icons/abayaview-touch.png',
    // ⚠️ وشعار الشيخة ستايل يُخزَّن مع القشرة لا عند أول طلب: كانت الترويسة
    // تعرض الحرفين «AS» حتى يُحمَّل، وشاشة البياعة تُفتح في المحلّ بشبكة ضعيفة.
    './brand/al-sheikha-style-logo.png',
    // ⚠️ وشعار قيمر وكاهي: صار يُعرض على بطاقة اختيار النشاط في اللوحة، ويجب أن
    // يظهر بلا إنترنت كذلك. وكان قبل اليوم يُطلب من مستودعٍ آخر في كل مرة.
    './brand/gaimer-w-kahi-logo.png'
];

// نطاقات يجب أن تمر إلى الشبكة دائمًا بلا اعتراض ولا تخزين.
const BYPASS_HOSTS = [
    'firestore.googleapis.com',
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'firebaseinstallations.googleapis.com',
    'firebase.googleapis.com',
    'firebaselogging-pa.googleapis.com',
    'google-analytics.com',
    'googletagmanager.com',
    'analytics.google.com'
];

// نطاقات محتواها ثابت مثبّت بالإصدار، فتخزينها آمن ويسرّع الإقلاع كثيرًا.
const CACHEABLE_HOSTS = [
    'www.gstatic.com',          // Firebase SDK v10.8.0
    'cdnjs.cloudflare.com',     // html2canvas, jspdf
    'cdn.jsdelivr.net',         // xlsx
    // خط الهوية (IBM Plex Sans Arabic + Mono). بلا تخزينه تفتح الصفحة بلا شبكة
    // بخط النظام، فتختلف أطوال الأسطر والعربية تحديدًا تبدو غريبة. الملفات
    // ثابتة الإصدار فلا خطر من تخزينها طويلًا.
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'raw.githubusercontent.com' // شعارات وصور الخلفية
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(SHELL_CACHE);
        // كل ملف على حدة: لو فشل واحد لا يفشل التثبيت كله.
        await Promise.all(SHELL_FILES.map(async (file) => {
            try {
                await cache.add(new Request(file, { cache: 'reload' }));
            } catch (e) {
                // ملف غير موجود أو الشبكة مقطوعة أثناء التثبيت — غير حرج.
            }
        }));
        // نفعّل النسخة الجديدة فورًا حتى يصل تحديث الكود بأسرع ما يمكن.
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = [SHELL_CACHE, ASSET_CACHE];
        const names = await caches.keys();
        await Promise.all(
            names.filter(n => n.startsWith('alsheikha-') && !keep.includes(n))
                 .map(n => caches.delete(n))
        );
        await self.clients.claim();
    })());
});

/** الشبكة أولًا: التحديث يصل فورًا، والكاش يُستخدم عند انقطاع الشبكة فقط. */
async function networkFirst(request) {
    const cache = await caches.open(SHELL_CACHE);
    try {
        // ⚠️ cache: 'no-cache' ضرورية ولا تُحذف.
        // GitHub Pages يُرسل `cache-control: max-age=600`، أي يأمر المتصفح بحفظ
        // الصفحة عشر دقائق. و«الشبكة أولًا» وحدها لا تكفي: طلب fetch العادي يمرّ
        // على كاش HTTP في المتصفح فيُعيد النسخة القديمة بلا أن يسأل الخادم —
        // وهذا ما جعل تبويبًا جديدًا لا يظهر للمالك بعد نشره فعلًا.
        //
        // 'no-cache' لا تعني تعطيل الكاش، بل تُلزم المتصفح بالتحقق من الخادم في
        // كل مرة: إن لم يتغيّر الملف يردّ الخادم 304 بلا تنزيل (رخيص جدًا)، وإن
        // تغيّر يُنزّل الجديد. فنحصل على أحدث نسخة دائمًا بلا هدر.
        //
        // نُمرّر request.url نصًا لا كائن Request، لأن إنشاء Request جديد من طلب
        // تنقّل (mode: 'navigate') يرفضه المتصفح.
        let response;
        try {
            response = await fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' });
        } catch (inner) {
            // متصفح لا يدعم الخيار أو حالة خاصة — لا نفقد الطلب.
            response = await fetch(request);
        }
        if (response && response.ok) {
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        // آخر ملاذ: أي صفحة مخزَّنة أفضل من صفحة خطأ المتصفح.
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
        throw err;
    }
}

/** الكاش أولًا مع تحديث صامت في الخلفية — للأصول الثابتة فقط. */
async function cacheFirst(request) {
    const cache = await caches.open(ASSET_CACHE);
    const cached = await cache.match(request);
    if (cached) {
        fetch(request)
            .then(res => { if (res && res.ok) cache.put(request, res.clone()); })
            .catch(() => {});
        return cached;
    }
    const response = await fetch(request);
    try {
        if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(request, response.clone());
        }
    } catch (e) { /* تخزين فاشل لا يمنع تسليم الرد */ }
    return response;
}

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // الكتابة والمصادقة لا تُعترض أبدًا.
    if (request.method !== 'GET') return;

    let url;
    try {
        url = new URL(request.url);
    } catch (e) {
        return;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Firebase: تمرير مباشر إلى الشبكة.
    if (BYPASS_HOSTS.some(host => url.hostname.includes(host))) return;

    // HTML: الشبكة أولًا دائمًا (انظر القاعدة الحاكمة في الأعلى).
    const accept = request.headers.get('accept') || '';
    if (request.mode === 'navigate' || accept.includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    const sameOrigin = url.origin === self.location.origin;
    if (sameOrigin || CACHEABLE_HOSTS.some(host => url.hostname.includes(host))) {
        event.respondWith(cacheFirst(request));
    }
    // غير ذلك: نتركه للمتصفح.
});


/* =============================================================================
   التنبيهات
   -----------------------------------------------------------------------------
   الضغط على التنبيه يجب أن يفتح اللوحة لا نسخة ثانية منها: نبحث أولًا عن نافذة
   مفتوحة ونُركّز عليها، ولا نفتح نافذة جديدة إلا إن لم تكن هناك واحدة. ونُمرّر
   التبويب المطلوب عبر postMessage حتى تنتقل الصفحة المفتوحة إليه.

   ⚠️ معالج `push` أدناه لا يعمل بلا مُرسِل. Web Push يحتاج طرفًا يملك مفتاحًا
   سريًّا (service account) ولا يجوز وضعه في صفحة ثابتة — أي زائر سيقرؤه
   ويُرسل تنبيهات لكل الأجهزة. فهو مكتوب جاهزًا حتى إذا أُضيفت Cloud Function
   لاحقًا عمل التنبيه والتطبيق مُغلق تمامًا بلا تعديل هنا.
   وللتوضيح: تنبيهات الويب لا تقبل ملفًا صوتيًّا مخصَّصًا لا على iOS ولا على
   أندرويد — تستخدم صوت النظام. الرنّة المميّزة تُشغَّل من داخل اللوحة نفسها.
   ============================================================================= */

self.addEventListener('notificationclick', (event) => {
    const data = (event.notification && event.notification.data) || {};
    const tab = data.tab || '';
    const target = data.url || './admin.html';
    event.notification.close();

    event.waitUntil((async () => {
        const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const open = all.find(c => c.url.includes('admin.html'));
        if (open) {
            try { await open.focus(); } catch (e) { /* بعض المتصفحات تمنع التركيز */ }
            if (tab) { try { open.postMessage({ type: 'OPEN_TAB', tab }); } catch (e) {} }
            return;
        }
        const url = tab ? `${target}#${tab}` : target;
        try { await self.clients.openWindow(url); } catch (e) {}
    })());
});

self.addEventListener('push', (event) => {
    let payload = {};
    try { payload = event.data ? event.data.json() : {}; } catch (e) {
        payload = { title: 'Al Sheikha Group', body: event.data ? event.data.text() : '' };
    }
    const title = payload.title || 'Al Sheikha Group';
    event.waitUntil(self.registration.showNotification(title, {
        body: payload.body || '',
        tag: payload.tag || 'alsheikha-push',
        renotify: true,
        requireInteraction: true,
        icon: './icons/admin-192.png',
        badge: './icons/admin-192.png',
        vibrate: [200, 100, 200, 100, 400],
        data: { tab: payload.tab || 'tab-variable', url: './admin.html' }
    }));
});
