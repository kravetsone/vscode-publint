# Change Log

## [0.0.4]

-   fixed the display of settings (https://github.com/kravetsone/vscode-publint/issues/3)
-   use [jsonpos](https://github.com/grantila/jsonpos) instead of [jsonc-parser](https://www.npmjs.com/package/jsonc-parser?activeTab=readme) which is much smaller (reduce bundle size from `90kb` => `80kb`)

## [0.0.3]

-   add `ignore-private-packages` option
-   add `ignored-rules` option
-   improve bundle size (remove picocolors and fs.realpath, thanks to https://github.com/danielroe/unplugin-purge-polyfills) (`99kb` => `90kb`)
-   some optimization (prevent useless actions and etc)

Fixes:

-   ignore private packages (in https://github.com/kravetsone/vscode-publint/pull/2)

## [0.0.2]

-   downgrade required version
-   add simple test
-   use `node:path` to handle basename/dirname

Fixes:

-   ignore non-json files and handle visibleTextEditors (in https://github.com/kravetsone/vscode-publint/pull/1)

## [0.0.1]

-   initial release
