#!/usr/bin/env node
/**
 * ⭐⭐⭐⭐⭐ كلُّ قراءةٍ تحتاجها شاشةٌ مجهولةُ الدخول يجب أن تكون مسموحةً لها في
 *   القواعد — وإلّا فالشاشةُ تُفتح وتُعرض فارغة.
 *
 * ⚠️⚠️⚠️ سببُ وجودِ هذا الملفّ عطلٌ حقيقيٌّ أوقف البيعَ في كلِّ المحلّات:
 *   قواعدُ v35 حذفت `isKiosk()` من `match /settings/{docId}` لتُخفي
 *   `salary_payouts` و`cash_account` عن المجهول — وهو تضييقٌ صحيحٌ في نفسه.
 *   لكنّ شاشةَ البياعة تقرأ `settings/abaya_discount` بجلسةٍ مجهولة، فصارت
 *   ممنوعة. وكانت تُقرأ في نفسِ `Promise.all` مع الكتالوج، فأسقطت الكتالوجَ
 *   كلَّه. النتيجة: «لا تظهر العبايات» في كلِّ محلّ، وبلا أيِّ خطأٍ ظاهرٍ في
 *   الكود، ولا في أيِّ اختبار.
 *
 * ⚠️ ولم يكن أيُّ فحصٍ قادرًا على رؤيته: الاختباراتُ تقيس الحسابَ (المال
 *   والساعات)، وحارسُ الأزرارِ يقيس الوصلة، وحارسُ التنفيذِ يقيس أنّ السطرَ
 *   يُنفَّذ. وهذا نوعٌ رابع: **اتفاقُ الكودِ مع القواعد**. ثلاثةُ حرّاسٍ كانت
 *   تمرُّ كلُّها بينما الشركةُ لا تبيع.
 *
 * الفكرة: تُقرأ الصفحاتُ التي تدخل **مجهولةً فقط**، ويُستخرج كلُّ مسارٍ
 * تقرؤه فعلًا (getDoc / getDocs / onSnapshot — لا الكتابة)، ثم يُسأل ملفُّ
 * القواعد: هل يُمنح `isKiosk()` حقَّ القراءةِ على هذا المسار؟
 */

const fs = require('fs');
const path = require('path');

// ⚠️⚠️ الصفحاتُ المستثناةُ بقصدٍ، ولكلٍّ سببٌ مكتوب — لا تُستثنى صفحةٌ بلا سبب:
//   admin.html      فيها `signInAnonymously` لكن قارئُها الحقيقيُّ دخولٌ ببريدٍ
//                   وكلمةِ مرور، فقياسُها بمقياسِ الكشكِ يُنتج مئاتَ إخفاقاتٍ كاذبة.
//   rules-check.html تقرأ المحظورَ **بقصد**: وظيفتُها إثباتُ أنّه محظور.
const EXCLUDED = new Set(['admin.html', 'rules-check.html']);

const root = process.argv[2] || '.';

// ---------------------------------------------------------------------------
// 1) قراءةُ ملفِّ القواعد: كلُّ كتلةِ match ومعها شرطُ القراءةِ الخاصُّ بها.
// ---------------------------------------------------------------------------
function parseRules(src) {
    const blocks = [];
    const re = /match\s+(\/[^\s{]*(?:\{[^}]*\}[^\s{]*)*)\s*\{/g;
    let m;
    while ((m = re.exec(src))) {
        const pattern = m[1];
        // جسمُ الكتلةِ حتى قوسِها المقابل، لا حتى أوّلِ قوسٍ مغلق.
        let depth = 1, i = re.lastIndex;
        while (i < src.length && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
        }
        const body = src.slice(re.lastIndex, i - 1);
        // الشروطُ المباشرةُ في هذه الكتلةِ فقط، بلا شروطِ الكتلِ المتداخلة.
        const own = body.replace(/match\s+\/[^{]*\{[\s\S]*?\n(\s*)\}/g, '');
        const reads = [];
        // `allow read: ...;` و`allow read, write: ...;` و`allow get/list`.
        const ar = /allow\s+([a-z,\s]*?)\s*:\s*if\s*([\s\S]*?);/g;
        let a;
        while ((a = ar.exec(own))) {
            const verbs = a[1].split(',').map(s => s.trim());
            if (verbs.some(v => v === 'read' || v === 'get' || v === 'list')) {
                reads.push(a[2].replace(/\s+/g, ' ').trim());
            }
        }
        if (reads.length) blocks.push({ pattern, reads });
    }
    return blocks;
}

// هل يُطابق نمطُ القاعدةِ هذا المسارَ؟ `{x}` تُطابق أيَّ مقطعٍ واحد.
function patternMatches(pattern, segments) {
    const p = pattern.replace(/^\//, '').split('/').filter(Boolean);
    // `{x=**}` تُطابق ما بقي.
    const multi = p.findIndex(s => /^\{.*=\*\*\}$/.test(s));
    if (multi >= 0) {
        if (segments.length < multi) return false;
        return p.slice(0, multi).every((s, i) => /^\{[^=]*\}$/.test(s) || s === segments[i]);
    }
    if (p.length !== segments.length) return false;
    return p.every((s, i) => (/^\{[^=]*\}$/.test(s) ? true : s === segments[i]));
}

// قواعدُ فايرستور **جمعيّة**: أيُّ كتلةٍ مطابقةٍ تمنح تكفي.
function kioskMayRead(blocks, segments) {
    const matching = blocks.filter(b => patternMatches(b.pattern, segments));
    const granting = matching.filter(b => b.reads.some(c => /\bisKiosk\s*\(\s*\)/.test(c)));
    return { allowed: granting.length > 0, matching };
}

// ---------------------------------------------------------------------------
// 2) استخراجُ القراءاتِ من صفحةٍ: الدالّةُ القارئةُ ثم أوّلُ مسارٍ بعدها.
// ---------------------------------------------------------------------------
function findReads(src) {
    const out = [];
    const re = /\b(getDocs|getDoc|onSnapshot)\s*\(/g;
    let m;
    while ((m = re.exec(src))) {
        const window = src.slice(m.index, m.index + 400);
        // `doc(db, 'a', 'b')` أدقُّ من `collection(db, 'a')`، فتُجرَّب أوّلًا.
        const d = window.match(/\bdoc\s*\(\s*db\s*,\s*['"]([A-Za-z_][\w]*)['"]\s*,\s*['"]([A-Za-z_][\w]*)['"]/);
        const c = window.match(/\bcollection\s*\(\s*db\s*,\s*['"]([A-Za-z_][\w]*)['"]/);
        const line = src.slice(0, m.index).split('\n').length;
        if (d && (!c || window.indexOf(d[0]) <= window.indexOf(c[0]))) {
            out.push({ segments: [d[1], d[2]], shown: `${d[1]}/${d[2]}`, line });
        } else if (c) {
            out.push({ segments: [c[1], '__doc__'], shown: `${c[1]}/{doc}`, line });
        }
    }
    return out;
}

// ---------------------------------------------------------------------------
// 3) حارسٌ على الحارس — يُجرَّب على العطلِ الحقيقيِّ الذي وقع.
// ---------------------------------------------------------------------------
function selfTest() {
    const broken = `
      function isKiosk() { return true; }
      service cloud.firestore { match /databases/{d}/documents {
        match /settings/{docId} { allow read: if isAdmin() || isStaff(); }
        match /settings/abaya_discount { allow read: if isGoodsClerk(); }
        match /settings/employee_roster { allow read: if isAdmin() || isKiosk(); }
        match /abaya_products/{p} { allow read: if isAdmin() || isKiosk(); }
        match /abaya_arrivals/{a} { allow read: if isAdmin(); }
      } }`;
    const fixed = broken.replace('abaya_discount { allow read: if isGoodsClerk();',
                                 'abaya_discount { allow read: if isGoodsClerk() || isKiosk();');
    const B = parseRules(broken), F = parseRules(fixed);

    const cases = [
        // [القواعد, المسار, المتوقّع, الوصف]
        [B, ['settings', 'abaya_discount'], false, 'the real regression must be caught'],
        [F, ['settings', 'abaya_discount'], true,  'the fix must be recognised'],
        [B, ['settings', 'employee_roster'], true, 'a narrow match that grants kiosk'],
        [B, ['settings', 'salary_payouts'], false, 'a settings doc with no kiosk grant'],
        [B, ['abaya_products', '__doc__'], true,   'a collection that grants kiosk'],
        [B, ['abaya_arrivals', '__doc__'], false,  'a collection that does not'],
        [B, ['no_such_collection', '__doc__'], false, 'an unknown path must not pass']
    ];
    let fails = 0;
    for (const [rules, segs, want, desc] of cases) {
        const got = kioskMayRead(rules, segs).allowed;
        if (got !== want) { console.error(`  SELF-TEST FAILED (${desc}): ${segs.join('/')} -> ${got}, wanted ${want}`); fails++; }
    }
    // ويجب أن يُفرِّق بين القراءةِ والكتابة.
    const wOnly = parseRules(`match /x/{i} { allow create: if isKiosk(); }`);
    if (kioskMayRead(wOnly, ['x', '__doc__']).allowed) { console.error('  SELF-TEST FAILED: a create-only grant was read as a read grant'); fails++; }

    // وأن يرى القراءةَ في الكود ولا يرى الكتابة.
    const reads = findReads(`
        await getDocs(collection(db, 'alpha'));
        await addDoc(collection(db, 'beta'), {});
        await getDoc(doc(db, 'settings', 'gamma'));
        onSnapshot(query(collection(db, 'delta'), limit(1)), cb);
    `).map(r => r.shown).sort();
    const wantReads = ['alpha/{doc}', 'delta/{doc}', 'settings/gamma'].sort();
    if (JSON.stringify(reads) !== JSON.stringify(wantReads)) {
        console.error(`  SELF-TEST FAILED: read extraction = ${JSON.stringify(reads)}, wanted ${JSON.stringify(wantReads)}`);
        fails++;
    }
    if (!cases.length) { console.error('  SELF-TEST SAW ZERO CASES'); return 2; }
    if (fails) return 2;
    console.log(`guard self-test OK (${cases.length + 2} cases, incl. the real v35 regression)`);
    return 0;
}

// ---------------------------------------------------------------------------
if (selfTest() !== 0) process.exit(2);

const rulesPath = path.join(root, 'firestore.rules');
if (!fs.existsSync(rulesPath)) { console.error('firestore.rules not found'); process.exit(2); }
const blocks = parseRules(fs.readFileSync(rulesPath, 'utf8'));
if (!blocks.length) { console.error('PARSED ZERO RULE BLOCKS — refusing to pass'); process.exit(2); }

const pages = fs.readdirSync(root)
    .filter(f => f.endsWith('.html') && !EXCLUDED.has(f))
    .filter(f => /signInAnonymously/.test(fs.readFileSync(path.join(root, f), 'utf8')));

if (!pages.length) { console.error('FOUND ZERO ANONYMOUS PAGES — refusing to pass'); process.exit(2); }

let denied = 0, checked = 0;
for (const page of pages) {
    const src = fs.readFileSync(path.join(root, page), 'utf8');
    const seen = new Map();
    for (const r of findReads(src)) if (!seen.has(r.shown)) seen.set(r.shown, r);
    for (const r of seen.values()) {
        checked++;
        const v = kioskMayRead(blocks, r.segments);
        if (!v.allowed) {
            denied++;
            console.error(`DENIED READ  ${page}:${r.line}  reads ${r.shown}  but no rule grants isKiosk() read`);
            console.error(`             matching rule blocks: ${v.matching.map(b => b.pattern).join(', ') || '(none at all)'}`);
            console.error(`             this screen will open and show nothing, with no error the user can act on.`);
        }
    }
}
if (!checked) { console.error('CHECKED ZERO READS — refusing to pass'); process.exit(2); }
console.log(`checked ${checked} anonymous read path(s) across ${pages.length} page(s) (${pages.join(', ')}), denied: ${denied}`);
process.exit(denied ? 1 : 0);
