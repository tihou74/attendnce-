#!/usr/bin/env python3
"""
فحص ملفات HTML في مشروع بلا أداة بناء.
Checks HTML files in a zero-build project.

يفحص:
  1) صياغة كل كتلة <script> مضمّنة (عبر node --check)
  2) توازن وسوم HTML
  3) مقابلة getElementById('x') بوجود id="x" في الترميز
  4) وجود الملفات المشار إليها في <script src="...">

التشغيل / Usage:
    python3 check-html.py index.html admin.html import-training.html

رمز الخروج 0 = سليم، 1 = يوجد فشل.
"""

import os
import re
import subprocess
import sys
import tempfile

# node ليس في PATH الافتراضي في هذه البيئة — انظر SKILL.md
NODE_CANDIDATES = [
    "/root/.nvm/versions/node/v24.19.0/bin/node",
    "node",
]

VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


def find_node():
    for candidate in NODE_CANDIDATES:
        try:
            subprocess.run([candidate, "--version"], capture_output=True, check=True)
            return candidate
        except (OSError, subprocess.CalledProcessError):
            continue
    return None


def check_inline_scripts(path, src, node):
    """يستخرج كل كتلة script مضمّنة ويفحص صياغتها."""
    failures = 0
    # ملاحظة: هذا الترشيح يطابق خطأً نص "<script src>" المكتوب حرفيًا داخل
    # تعليق HTML، فيُنتج فشلاً وهميًا. تجنّب كتابة وسوم script في التعليقات.
    blocks = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", src, re.S)
    print(f"  كتل script مضمّنة: {len(blocks)}")
    if not node:
        print("  !! تعذّر إيجاد node — تم تخطي فحص الصياغة (لا تعتبره ناجحًا)")
        return 1
    for i, body in enumerate(blocks):
        with tempfile.NamedTemporaryFile("w", suffix=".mjs", delete=False,
                                         encoding="utf-8") as fh:
            fh.write(body)
            tmp = fh.name
        result = subprocess.run([node, "--check", tmp], capture_output=True, text=True)
        os.unlink(tmp)
        if result.returncode == 0:
            print(f"    block#{i}: OK ({len(body)} chars)")
        else:
            print(f"    block#{i}: FAIL\n{result.stderr[:600]}")
            failures += 1
    return failures


def check_tag_balance(src):
    """يتحقق من توازن وسوم HTML بعد إزالة التعليقات والسكربت والأنماط."""
    stripped = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    stripped = re.sub(r"<script[^>]*>.*?</script>", "", stripped, flags=re.S)
    stripped = re.sub(r"<style[^>]*>.*?</style>", "", stripped, flags=re.S)

    stack, strays = [], []
    for match in re.finditer(r"<(/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(/?)>", stripped):
        closing, tag, _attrs, self_close = match.groups()
        tag = tag.lower()
        if tag in VOID_ELEMENTS or self_close:
            continue
        if not closing:
            stack.append(tag)
        elif stack and stack[-1] == tag:
            stack.pop()
        elif tag in stack:
            while stack and stack[-1] != tag:
                strays.append(f"unclosed <{stack.pop()}>")
            if stack:
                stack.pop()
        else:
            strays.append(f"stray </{tag}>")

    if stack or strays:
        print(f"  توازن الوسوم: !! unclosed={stack} errors={strays[:5]}")
        return 1
    print("  توازن الوسوم: BALANCED")
    return 0


def check_element_ids(src):
    """يقابل getElementById('x') بوجود id=\"x\" في الترميز."""
    ids_in_markup = set(re.findall(r'\bid="([^"]+)"', src))
    refs = set(re.findall(r"getElementById\('([^']+)'\)", src))
    refs |= set(re.findall(r'getElementById\("([^"]+)"\)', src))
    missing = sorted(r for r in refs if r not in ids_in_markup)
    print(f"  ids في الترميز: {len(ids_in_markup)} · getElementById: {len(refs)}")
    if missing:
        # معرّفات مبنية بقوالب نصية تُنشأ في وقت التشغيل وليست أخطاء
        print(f"  !! مراجع بلا id مطابق: {missing}")
        print("     (تجاهل ما كان مبنيًا بقالب نصي مثل rowStatus${i})")
        return 1
    print("  كل المراجع لها id مطابق")
    return 0


def check_script_srcs(path, src):
    """يتحقق من وجود الملفات المشار إليها في script src."""
    base = os.path.dirname(os.path.abspath(path))
    failures = 0
    for ref in re.findall(r'<script src="([^"]+)"', src):
        if ref.startswith(("http://", "https://", "//")):
            continue
        target = os.path.join(base, ref)
        if os.path.exists(target):
            print(f"  src {ref}: موجود")
        else:
            print(f"  src {ref}: !! مفقود")
            failures += 1
    return failures


def main():
    paths = sys.argv[1:]
    if not paths:
        print(__doc__)
        return 1

    node = find_node()
    print(f"node: {node or 'غير موجود'}\n")

    total_failures = 0
    for path in paths:
        if not os.path.exists(path):
            print(f"{path}: !! الملف غير موجود")
            total_failures += 1
            continue
        print(f"=== {path} ===")
        src = open(path, encoding="utf-8").read()
        total_failures += check_inline_scripts(path, src, node)
        total_failures += check_tag_balance(src)
        total_failures += check_element_ids(src)
        total_failures += check_script_srcs(path, src)
        print("")

    if total_failures:
        print(f"!! فشل: {total_failures} مشكلة")
        return 1
    print("كل الملفات سليمة")
    return 0


if __name__ == "__main__":
    sys.exit(main())
