# This repository no longer holds the application

The Al Sheikha Group HR, payroll, tips and abaya sales system now lives at:

**https://hr.alsheikhagroup.com**

The source code moved to a private repository. What remains here is a set of
redirect pages and nothing else — no code, no configuration, no security rules.

## Why these files still exist

Employees, managers and saleswomen added the app to the home screens of their
phones while it was served from this address. Each of those icons points at a
file in this repository. Deleting them would break every icon at once, for
everyone, with no warning — and installing the managers' icon on iPhone was
difficult enough the first time.

So this address keeps answering, and sends whoever knocks to the new one.

Three details that matter, in case anyone edits these files:

- **The query string and hash are preserved.** The managers' door is
  `index.html?report=1`; a redirect that dropped `?report=1` would quietly
  land them on the staff screen instead.
- **`404.html` carries the same redirect**, so an old path nobody remembered
  still arrives in the right place.
- **`.nojekyll` must stay.** Without it GitHub treats these pages as templates.

`sw.js` is a service worker whose only job is to delete itself, clear the
caches it left on employees' devices, and reload any open window so it reaches
the redirect. Devices that still hold the old app stop serving it.

## Nothing here is secret

These pages contain a public address and a timer. There is no key, no rule and
no record in this repository, which is exactly why it can stay public while the
application itself does not.
