#!/usr/bin/env node
/**
 * تدقيق ملفات محتوى التدريب وسجلها.
 * Validates every training-content/*.js source file and the registry they build.
 *
 * التشغيل / Usage:
 *   export PATH="$PATH:/root/.nvm/versions/node/v24.19.0/bin"
 *   node .kiro/skills/verify-static-project/scripts/validate-training-content.js [dir]
 *
 * رمز الخروج 0 = كل شيء سليم، 1 = يوجد فشل.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SEPARATOR = '———————————————';
const SAFE_LIMIT_BYTES = 900 * 1024;
const FIRESTORE_LIMIT_BYTES = 1048576;

const dir = path.resolve(process.argv[2] || 'training-content');

if (!fs.existsSync(dir)) {
    console.error(`!! المجلد غير موجود: ${dir}`);
    process.exit(1);
}

// الملفات تسجّل نفسها على window، فنوفّر بديلاً وهميًا قبل التحميل.
global.window = {};

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
if (!files.length) {
    console.error(`!! لا توجد ملفات .js في ${dir}`);
    process.exit(1);
}

console.log(`ملفات المحتوى: ${files.length}`);
for (const f of files) {
    try {
        require(path.join(dir, f));
        console.log(`  OK   ${f}`);
    } catch (err) {
        console.error(`  FAIL ${f}\n       ${err.message}`);
        process.exit(1);
    }
}

const registry = global.window.TRAINING_CONTENT_REGISTRY || [];
if (!registry.length) {
    console.error('!! لم يُسجَّل أي مستند — تحقّق من أن كل ملف يدفع إلى window.TRAINING_CONTENT_REGISTRY');
    process.exit(1);
}

/** نفس المعادلة الموجودة في index.html و admin.html و import-training.html. */
function docId(restaurant, department) {
    return `${restaurant}__${department}`.replace(/\s+/g, '_');
}

function byteSize(obj) {
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}

console.log(`\nالمستندات المسجّلة: ${registry.length}\n`);

const seen = new Map();
let failures = 0;

for (const entry of registry) {
    const id = docId(entry.restaurant, entry.department);
    const sections = entry.sections || [];
    const bytes = byteSize({
        restaurant: entry.restaurant,
        department: entry.department,
        sections
    });

    const problems = [];

    if (seen.has(id)) {
        problems.push(`معرّف مكرر (موجود أيضًا في ${seen.get(id)})`);
    }
    seen.set(id, entry.sourceFile || 'unknown');

    if (!sections.length) problems.push('لا يحتوي أي قسم');

    const noHeading = sections.filter((s) => !s.heading || !String(s.heading).trim()).length;
    const noText = sections.filter((s) => !s.text || !String(s.text).trim()).length;
    const noSeparator = sections.filter((s) => !String(s.text || '').includes(SEPARATOR));
    const noBlankLine = sections.filter((s) => !/\n{2,}/.test(String(s.text || '')));

    if (noHeading) problems.push(`${noHeading} قسم بلا عنوان`);
    if (noText) problems.push(`${noText} قسم بلا نص`);
    if (noSeparator.length) {
        problems.push(
            `${noSeparator.length} قسم بلا الفاصل العربي/الإنجليزي: ` +
            noSeparator.map((s) => String(s.heading).slice(0, 40)).join(' | ')
        );
    }
    if (noBlankLine.length) {
        problems.push(
            `${noBlankLine.length} قسم بلا سطر فارغ (يكسر اتجاه النص): ` +
            noBlankLine.map((s) => String(s.heading).slice(0, 40)).join(' | ')
        );
    }

    // فراغ اسم براند لم يُستبدل، مثل «بك في ، معك...»
    const joined = sections.map((s) => s.text).join('\n');
    if (/في\s+،/.test(joined)) problems.push('يوجد فراغ اسم براند لم يُستبدل («في ،»)');

    if (bytes > FIRESTORE_LIMIT_BYTES) problems.push(`تجاوز سقف Firestore (1MB)`);
    else if (bytes > SAFE_LIMIT_BYTES) problems.push(`تجاوز الحد الآمن 900KB`);

    const sizeLabel = `${(bytes / 1024).toFixed(1)} KB`;
    const status = problems.length ? 'FAIL' : 'OK  ';
    console.log(
        `${status} ${id.padEnd(30)} ${String(sections.length).padStart(3)} أقسام ${sizeLabel.padStart(10)}`
    );
    for (const p of problems) console.log(`       - ${p}`);
    if (problems.length) failures++;
}

// الأدلة المشتركة: نسختا البراندين يجب أن تتطابقا أو يُستبدل اسم البراند فقط.
const byDepartment = new Map();
for (const entry of registry) {
    if (!byDepartment.has(entry.department)) byDepartment.set(entry.department, []);
    byDepartment.get(entry.department).push(entry);
}

console.log('');
for (const [department, entries] of byDepartment) {
    if (entries.length < 2) continue;
    const [a, b] = entries;
    const identical = JSON.stringify(a.sections) === JSON.stringify(b.sections);
    const sameCount = a.sections.length === b.sections.length;
    if (identical) {
        console.log(`دليل مشترك ${department}: النسختان متطابقتان تمامًا (لا اسم براند داخل النص) ✓`);
    } else if (sameCount) {
        console.log(`دليل مشترك ${department}: نفس عدد الأقسام مع استبدال اسم البراند ✓`);
    } else {
        console.log(`دليل مشترك ${department}: !! عدد الأقسام مختلف (${a.sections.length} مقابل ${b.sections.length})`);
        failures++;
    }
}

const totalSections = registry.reduce((sum, e) => sum + (e.sections || []).length, 0);
console.log('');
if (failures) {
    console.error(`!! فشل: ${failures} مستند/فحص به مشكلة`);
    process.exit(1);
}
console.log(`لا مشاكل — ${registry.length} مستند، ${totalSections} قسمًا إجماليًا`);
