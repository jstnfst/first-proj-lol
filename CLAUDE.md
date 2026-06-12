# Vendored Repositories

The `repos/` directory contains vendored third-party source code added via `git subtree`. Treat it as **read-only reference material** — do not modify files inside it.

## repos/effect

Source: https://github.com/Effect-TS/effect.git (main branch)

The Effect TypeScript library. Use it as a reference for types, APIs, and implementation details when working with Effect in this project.

To update:
```
git subtree pull --prefix=repos/effect https://github.com/Effect-TS/effect.git main --squash
```
