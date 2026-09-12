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

// v3: أُزيل التحويل التلقائي من report.html (كان يُبطل تثبيت تطبيق المديرين على
// iOS)، ويجب إبطال
// الكاش القديم حتى لا يبقى من ثبّت التطبيق سابقًا على النسخة القديمة.
const CACHE_VERSION = 'v3';
const SHELL_CACHE = `alsheikha-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `alsheikha-assets-${CACHE_VERSION}`;

// نسخة احتياطية تُقدَّم فقط إذا كانت الشبكة مقطوعة.
const SHELL_FILES = [
    './',
    './index.html',
    './admin.html',
    './report.html',
    './manifest.json',
    './manifest-report.json',
    './manifest-admin.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png'
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
        const response = await fetch(request);
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
