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
// 2) استخراجُ القراءاتِ من صفحة.
//
// ⚠️⚠️⚠️ النسخةُ الأولى من هذا الملفّ كانت تفحص **٨ قراءاتٍ من ٣٢** وتقول
//   «سليم» — وتتخطّى الباقيَ **صامتةً** لأنّ مسارَها مكتوبٌ بثابتٍ
//   (`collection(db, ABAYA_INVOICES_COLL)`) لا بنصٍّ حرفيّ. ومنها قراءةُ
//   قائمةِ الأسماء نفسِها، وهي أهمُّ قراءةٍ في شاشةِ الموظف.
//   وحارسٌ يفحص الربعَ ويُعلن النجاحَ على الكلِّ أخطرُ من غيابِه: يُعطي
//   طمأنينةً كاذبةً ويُغلق البابَ على الفحصِ اليدويّ.
//
// فصار لزامًا أمران:
//   (1) تُحلَّ الثوابتُ من تصريحِها في نفسِ الصفحة.
//   (2) ما لا يُحَلّ **يُعلَن ويُسقط الفحص** — لا يُتخطّى. ويُحاسَب العددُ:
//       مجموعُ (المحلولة + غيرِ المحلولة) يجب أن يساوي عددَ نداءاتِ القراءةِ
//       كلِّها، وإلّا فثمّة نداءٌ لم يرَه الحارسُ أصلًا.
// ---------------------------------------------------------------------------

// `const X = 'literal'` / `let` / `var` — خريطةُ الثوابتِ في الصفحة.
function constMap(src) {
    const map = new Map();
    const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) if (!map.has(m[1])) map.set(m[1], m[2]);
    return map;
}

/**
 * مراجعُ الاستعلامِ المُعدَّةُ في متغيّر: `const q = query(collection(db, "x"), ...)`
 * ثم `getDocs(q)` — وهي الصيغةُ الغالبةُ عند وجودِ `where`.
 *
 * ⚠️⚠️ ولا تُجمع في خريطةٍ باسمِ المتغيّرِ وحدَه: الاسمُ `q` مُعادُ استخدامُه في
 *   دوالَّ مختلفةٍ لمجموعاتٍ مختلفة (في هذه الصفحةِ `attendance` مرّتين و
 *   `training_acknowledgments` مرّة). فخريطةٌ مسطّحةٌ تُرجِع الأوّلَ للجميع،
 *   فيُحكَم على قراءةٍ بمسارِ قراءةٍ أخرى — وهو خطأٌ قد **يستر** منعًا حقيقيًّا.
 *   فتُحفظ المواضعُ، ويُؤخذ **أقربُ تصريحٍ سابقٍ** لموضعِ القراءة.
 */
function refAssignments(src) {
    const out = [];
    const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(?:query\s*\(\s*)?(collection|doc)\s*\(\s*db\s*,\s*([^,)]+?)\s*(?:,\s*([^,)]+?)\s*)?[,)]/g;
    let m;
    while ((m = re.exec(src))) {
        out.push({ name: m[1], kind: m[2], collRaw: m[3], docRaw: m[4], at: m.index });
    }
    return out;
}

// نصُّ وسائطِ النداءِ من قوسِه الفاتحِ إلى قوسِه المقابل — لا نافذةٌ بعددٍ
// من الحروف، فنافذةٌ ثابتةٌ تخلط نداءَين في `Promise.all([a, b])`.
function callArgs(src, openParenIdx) {
    let depth = 0, i = openParenIdx;
    for (; i < src.length; i++) {
        if (src[i] === '(') depth++;
        else if (src[i] === ')') { depth--; if (depth === 0) return src.slice(openParenIdx + 1, i); }
    }
    return src.slice(openParenIdx + 1, Math.min(src.length, openParenIdx + 400));
}

function findReads(src) {
    const out = [];
    const consts = constMap(src);
    const refs = refAssignments(src);
    const resolve = (raw) => {
        const t = raw.trim();
        const lit = t.match(/^['"]([^'"]+)['"]$/);
        if (lit) return lit[1];
        if (/^[A-Za-z_$][\w$]*$/.test(t) && consts.has(t)) return consts.get(t);
        return null;
    };
    const re = /\b(getDocs|getDoc|onSnapshot)\s*\(/g;
    let m;
    while ((m = re.exec(src))) {
        const open = src.indexOf('(', m.index + m[1].length - 1);
        const args = callArgs(src, open);
        const line = src.slice(0, m.index).split('\n').length;

        // `doc(db, A, B)` أدقُّ من `collection(db, A)`، فتُجرَّب أوّلًا — وتُختار
        // الأسبقُ موضعًا حتى لا يُلتقط مسارٌ من نداءٍ متداخلٍ أبعد.
        const d = args.match(/\bdoc\s*\(\s*db\s*,\s*([^,)]+),\s*([^,)]+)/);
        const c = args.match(/\bcollection\s*\(\s*db\s*,\s*([^,)]+)/);
        const pick = (d && c) ? (args.indexOf(d[0]) <= args.indexOf(c[0]) ? 'd' : 'c') : (d ? 'd' : (c ? 'c' : null));

        if (pick === 'd') {
            const coll = resolve(d[1]), docId = resolve(d[2]);
            if (coll && docId) out.push({ segments: [coll, docId], shown: `${coll}/${docId}`, line });
            // مستندٌ باسمٍ متغيّرٍ داخل مجموعةٍ معروفة: المجموعةُ كافيةٌ للحكم،
            // لأنّ الإذنَ يُمنح على نمطِ المسارِ لا على اسمِ مستندٍ بعينه.
            else if (coll) out.push({ segments: [coll, '__doc__'], shown: `${coll}/{doc}`, line });
            else out.push({ unresolved: d[1].trim(), line, raw: args.slice(0, 70).replace(/\s+/g, ' ') });
        } else if (pick === 'c') {
            const coll = resolve(c[1]);
            if (coll) out.push({ segments: [coll, '__doc__'], shown: `${coll}/{doc}`, line });
            else out.push({ unresolved: c[1].trim(), line, raw: args.slice(0, 70).replace(/\s+/g, ' ') });
        } else {
            // مرجعٌ مُعدٌّ في متغيّر: يُتبَّع إلى **أقربِ** تصريحٍ سابقٍ له.
            const name = args.trim().split(/[\s,)]/)[0];
            const prior = /^[A-Za-z_$][\w$]*$/.test(name)
                ? refs.filter(a => a.name === name && a.at < m.index).sort((x, y) => y.at - x.at)[0]
                : null;
            const coll = prior ? resolve(prior.collRaw) : null;
            const docId = (prior && prior.kind === 'doc' && prior.docRaw) ? resolve(prior.docRaw) : null;
            if (coll && docId) out.push({ segments: [coll, docId], shown: `${coll}/${docId}`, line });
            else if (coll) out.push({ segments: [coll, '__doc__'], shown: `${coll}/{doc}`, line });
            else out.push({ unresolved: `variable "${name}"`, line, raw: args.slice(0, 70).replace(/\s+/g, ' ') });
        }
    }
    return out;
}

// عددُ نداءاتِ القراءةِ كلِّها — لتُحاسَب عليه نتيجةُ findReads.
function countReadCalls(src) {
    return (src.match(/\b(?:getDocs|getDoc|onSnapshot)\s*\(/g) || []).length;
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

    // وأن يرى القراءةَ في الكود ولا يرى الكتابة، ويَحُلَّ الثوابت.
    const sample = `
        const SHELF_COLL = 'abaya_shelf_tasks';
        const ROSTER_DOC = 'employee_roster';
        await getDocs(collection(db, 'alpha'));
        await addDoc(collection(db, 'beta'), {});
        await getDoc(doc(db, 'settings', 'gamma'));
        onSnapshot(query(collection(db, 'delta'), limit(1)), cb);
        await getDocs(query(collection(db, SHELF_COLL), where('x','==',1)));
        await getDoc(doc(db, "settings", ROSTER_DOC));
        await getDoc(doc(db, SHELF_COLL, t.id));
        const [a, b] = await Promise.all([getDocs(collection(db, 'eps')), getDoc(doc(db, 'settings', 'zeta'))]);
    `;
    const got = findReads(sample);
    const shown = got.filter(r => !r.unresolved).map(r => r.shown).sort();
    const wantReads = ['alpha/{doc}', 'delta/{doc}', 'settings/gamma', 'abaya_shelf_tasks/{doc}',
                       'settings/employee_roster', 'abaya_shelf_tasks/{doc}', 'eps/{doc}', 'settings/zeta'].sort();
    if (JSON.stringify(shown) !== JSON.stringify(wantReads)) {
        console.error(`  SELF-TEST FAILED: read extraction = ${JSON.stringify(shown)}`);
        console.error(`                              wanted = ${JSON.stringify(wantReads)}`);
        fails++;
    }
    // ⚠️⚠️ وأهمُّ فحصٍ هنا: كلُّ نداءِ قراءةٍ يجب أن يُحاسَب عليه — إمّا يُحَلّ
    //   أو يُعلَن. وهذا بعينه ما فشل فيه الحارسُ أوّلَ مرّة.
    if (got.length !== countReadCalls(sample)) {
        console.error(`  SELF-TEST FAILED: ${countReadCalls(sample)} read calls but ${got.length} accounted for`);
        fails++;
    }
    // وثابتٌ غيرُ معروفٍ يجب أن يُعلَن لا أن يُتخطّى.
    const un = findReads(`await getDocs(collection(db, MYSTERY_COLL));`);
    if (un.length !== 1 || !un[0].unresolved) { console.error('  SELF-TEST FAILED: an unknown constant was skipped silently'); fails++; }

    // ⚠️⚠️ الفخُّ الحقيقيُّ: نفسُ اسمِ المتغيّرِ لمجموعتَين مختلفتَين. لو أُخذ
    //   أوّلُ تصريحٍ بدل أقربِه، لحُكم على القراءةِ الثانيةِ بمسارِ الأولى —
    //   فيُستر منعٌ حقيقيٌّ ويُقال «سليم».
    const reuse = findReads(`
        function one() { const q = query(collection(db, "attendance"), where("a","==",1)); return getDocs(q); }
        function two() { const q = query(collection(db, "training_acknowledgments"), where("b","==",2)); return getDocs(q); }
        function three() { const ref = doc(db, "settings", "employee_roster"); return getDoc(ref); }
    `);
    const reuseShown = reuse.map(r => r.shown);
    const reuseWant = ['attendance/{doc}', 'training_acknowledgments/{doc}', 'settings/employee_roster'];
    if (JSON.stringify(reuseShown) !== JSON.stringify(reuseWant)) {
        console.error(`  SELF-TEST FAILED: variable reuse resolved to ${JSON.stringify(reuseShown)}, wanted ${JSON.stringify(reuseWant)}`);
        fails++;
    }
    // وتتبُّعُ متغيّرٍ لا تصريحَ له يجب أن يُعلَن.
    const noDecl = findReads(`return getDocs(mysteryRef);`);
    if (noDecl.length !== 1 || !noDecl[0].unresolved) { console.error('  SELF-TEST FAILED: an untraceable variable was skipped silently'); fails++; }

    if (!cases.length) { console.error('  SELF-TEST SAW ZERO CASES'); return 2; }
    if (fails) return 2;
    console.log(`guard self-test OK (${cases.length + 7} cases, incl. the real v35 regression, the under-counting bug and variable reuse)`);
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

let denied = 0, checked = 0, unresolved = 0, calls = 0;
for (const page of pages) {
    const src = fs.readFileSync(path.join(root, page), 'utf8');
    const found = findReads(src);
    calls += countReadCalls(src);

    // ⚠️⚠️ المحاسبةُ أوّلًا: نداءٌ لم يُحاسَب عليه الحارسُ هو ثقبٌ في الحارسِ
    //   نفسِه، لا في الكود. والحارسُ الذي لا يعرف ما فاته يكذب.
    if (found.length !== countReadCalls(src)) {
        console.error(`GUARD GAP in ${page}: ${countReadCalls(src)} read call(s) but only ${found.length} accounted for`);
        process.exit(2);
    }

    const seen = new Map();
    for (const r of found) {
        if (r.unresolved) {
            unresolved++;
            console.error(`UNRESOLVED   ${page}:${r.line}  cannot tell which path is read: ${r.unresolved}`);
            console.error(`             near: ${r.raw}`);
            console.error(`             the guard will not pretend this one is safe. Use a string or a const`);
            console.error(`             declared in this page so the rules can be checked against it.`);
            continue;
        }
        if (!seen.has(r.shown)) seen.set(r.shown, r);
    }
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
console.log(`accounted for ${calls} read call(s) across ${pages.length} page(s) (${pages.join(', ')})`);
console.log(`distinct paths checked: ${checked}, denied: ${denied}, unresolved: ${unresolved}`);
process.exit((denied || unresolved) ? 1 : 0);
