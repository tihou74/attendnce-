#!/usr/bin/env node
/**
 * ⭐⭐⭐⭐⭐ الموقعُ يُقدَّم بنفسِ المساراتِ التي بُني عليها — بلا أيِّ تحويل.
 *
 * ⚠️⚠️⚠️ سببُ وجودِ هذا الملفّ عطلٌ حقيقيٌّ أوقف لوحةَ المدراء تمامًا:
 *   أُضيف `cleanUrls: true` إلى firebase.json بحجّةِ «روابطَ أنظف»
 *   (`/admin` بدل `/admin.html`) — وقُدِّم للمالكِ على أنّه **ميزة**.
 *   فصار `index.html?report=1` يدور في تحويلٍ لا ينتهي:
 *   `ERR_TOO_MANY_REDIRECTS`. والمديرُ لا يملك طريقًا آخرَ إلى شاشته.
 *
 * ⚠️ وما كان أخطرَ ولم يظهر بعد: العاملُ الخِدميُّ يحفظ سبعةَ مساراتِ .html
 *   مسبقًا واحتياطُه `cache.match('./index.html')`؛ و**كلُّ** ملفّاتِ التعريف
 *   `start_url` تنتهي بـ.html، أي أنّ كلَّ أيقونةٍ مثبَّتةٍ على هاتفِ كلِّ
 *   موظفٍ تشير إلى مسارٍ صار تحويلًا.
 *
 * ⚠️ وتحويلُ 301 **يُحفظ في المتصفّحِ حفظًا دائمًا**: فحتى بعد إزالةِ الإعداد
 *   يبقى الجهازُ الذي رآه يدور، حتى تُمحى بياناتُ الموقع. أي أنّ هذا الخطأَ
 *   يُؤذي بعد إصلاحِه — ولهذا يُمنع قبل النشرِ لا بعده.
 */

const fs = require('fs');
const path = require('path');

const root = process.argv[2] || '.';

/**
 * يُرجع قائمةَ الأسبابِ — فارغةً إن كان الإعدادُ سليمًا.
 * @param {object} cfg       محتوى firebase.json
 * @param {string[]} relied  المساراتُ التي يعتمد عليها التطبيقُ حرفيًّا
 */
function reasons(cfg, relied) {
    const out = [];
    const h = (cfg && cfg.hosting) || {};
    const htmlRelied = relied.filter(p => /\.html(\?|$)/.test(p));

    if (h.cleanUrls === true && htmlRelied.length) {
        out.push(`cleanUrls is ON, but ${htmlRelied.length} path(s) the app loads by name end in .html. `
            + `Firebase answers each of those with a 301 redirect. One of them is the managers' door.`);
    }
    // ⚠️ trailingSlash مع cleanUrls هو ما يصنع **الدورةَ** لا تحويلًا واحدًا.
    if (h.trailingSlash === false && h.cleanUrls === true) {
        out.push('cleanUrls and trailingSlash:false together produce a redirect LOOP on the index path '
            + '(ERR_TOO_MANY_REDIRECTS), not merely one extra hop.');
    }
    if (h.trailingSlash === true) {
        out.push('trailingSlash is ON: every .html path would gain a slash and stop matching the '
            + 'service-worker cache keys.');
    }
    // تحويلٌ صريحٌ يبتلع مسارًا يعتمد عليه التطبيق.
    for (const r of (h.redirects || [])) {
        const src = String(r.source || r.regex || '');
        const hit = relied.find(p => src === p || src === p.replace(/^\.\//, '/') || src === '/**');
        if (hit) out.push(`a redirect rule (source "${src}") swallows "${hit}", which the app loads by name.`);
    }
    return out;
}

// المساراتُ التي يعتمد عليها التطبيقُ حرفيًّا: العاملُ الخِدميُّ، وملفّاتُ
// التعريف، والروابطُ الداخليّة.
function reliedPaths(dir) {
    const set = new Set();
    const sw = path.join(dir, 'sw.js');
    if (fs.existsSync(sw)) {
        const s = fs.readFileSync(sw, 'utf8');
        for (const m of s.matchAll(/['"](\.\/[A-Za-z0-9_-]+\.html)['"]/g)) set.add(m[1]);
    }
    for (const f of fs.readdirSync(dir).filter(x => /^manifest.*\.json$/.test(x))) {
        try {
            const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
            if (d.start_url) set.add(String(d.start_url));
        } catch (e) { /* ملفٌّ تالفٌ يُلتقط في مكانٍ آخر */ }
    }
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
        const s = fs.readFileSync(path.join(dir, f), 'utf8');
        for (const m of s.matchAll(/['"](\.\/[A-Za-z0-9_-]+\.html(?:\?[^'"]*)?)['"]/g)) set.add(m[1]);
    }
    return [...set];
}

// ---------------------------------------------------------------------------
// ⚠️ حارسٌ على الحارس: يجب أن يسقطَ على الإعدادِ الذي عطّل لوحةَ المدراء فعلًا،
//   وأن يمرَّ على الإعدادِ المُصلَح. وحارسٌ لم يُجرَّب يقول «سليم» دائمًا.
// ---------------------------------------------------------------------------
function selfTest() {
    const relied = ['./index.html', './admin.html', './index.html?report=1', './manager.html'];
    const cases = [
        [{ hosting: { cleanUrls: true, trailingSlash: false } }, relied, true,  'the exact config that broke the managers'],
        [{ hosting: { cleanUrls: true } },                        relied, true,  'cleanUrls alone still redirects .html'],
        [{ hosting: { trailingSlash: true } },                    relied, true,  'trailingSlash on breaks cache keys'],
        [{ hosting: {} },                                         relied, false, 'the fixed config must pass'],
        [{ hosting: { cleanUrls: true } },        ['./styles.css'], false, 'cleanUrls is fine when nothing relies on .html'],
        [{ hosting: { redirects: [{ source: '/**', type: 301 }] } }, relied, true, 'a catch-all redirect swallows the app'],
        [{ hosting: { redirects: [{ source: '/old', type: 301 }] } }, relied, false, 'an unrelated redirect is fine']
    ];
    let fails = 0;
    for (const [cfg, rel, wantBad, desc] of cases) {
        const got = reasons(cfg, rel).length > 0;
        if (got !== wantBad) { console.error(`  SELF-TEST FAILED (${desc}): flagged=${got}, wanted=${wantBad}`); fails++; }
    }
    // ويجب أن يرى المساراتِ فعلًا: فحصٌ لا يجد مسارًا واحدًا يمرُّ دائمًا.
    if (!reliedPaths(root).length) { console.error('  SELF-TEST FAILED: found zero relied-upon paths'); fails++; }
    if (!cases.length) { console.error('  SELF-TEST SAW ZERO CASES'); return 2; }
    if (fails) return 2;
    console.log(`guard self-test OK (${cases.length + 1} cases, incl. the config that broke the managers' screen)`);
    return 0;
}

if (selfTest() !== 0) process.exit(2);

const cfgPath = path.join(root, 'firebase.json');
if (!fs.existsSync(cfgPath)) { console.error('firebase.json not found'); process.exit(2); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const relied = reliedPaths(root);
if (!relied.length) { console.error('FOUND ZERO RELIED-UPON PATHS — refusing to pass'); process.exit(2); }

const bad = reasons(cfg, relied);
if (bad.length) {
    console.error('');
    console.error('========== THE HOSTING CONFIG WOULD REDIRECT THE APP\'S OWN PATHS ==========');
    for (const b of bad) console.error('  • ' + b);
    console.error('');
    console.error('  Paths the app loads by name (' + relied.length + '):');
    for (const p of relied.sort()) console.error('      ' + p);
    console.error('');
    console.error('  Remove cleanUrls and trailingSlash from firebase.json. This app is built on');
    console.error('  explicit .html paths and must be served exactly as they are written.');
    console.error('  Note: a 301 is cached by the browser for a long time, so this fault keeps');
    console.error('  hurting after it is fixed until site data is cleared. That is why it is');
    console.error('  blocked before the deploy and not after.');
    console.error('===========================================================================');
    process.exit(1);
}
console.log(`hosting config OK — ${relied.length} app path(s) are served without any redirect`);
