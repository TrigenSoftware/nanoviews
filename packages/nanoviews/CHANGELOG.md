# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/TrigenSoftware/nanoviews/compare/v1.0.0-alpha.9...v1.0.0) (2026-09-01)

### Features

* add `as_` to hand a row through a transform ([#207](https://github.com/TrigenSoftware/nanoviews/issues/207)) ([2891ec4](https://github.com/TrigenSoftware/nanoviews/commit/2891ec4987cb2358c235739b430d6445b0325615))
* add `match_` for a cascade of conditions ([#219](https://github.com/TrigenSoftware/nanoviews/issues/219)) ([1065b20](https://github.com/TrigenSoftware/nanoviews/commit/1065b204d8e09b1b1cf82353ac7a34d6b1d33e1a))
* add `props$` to read any prop in accessor form ([#212](https://github.com/TrigenSoftware/nanoviews/issues/212)) ([3cd1d77](https://github.com/TrigenSoftware/nanoviews/commit/3cd1d7709fc721ae2ff87ccfda648e9d4313758c))
* add `show_` with pausable effect scopes ([#225](https://github.com/TrigenSoftware/nanoviews/issues/225)) ([4c2490d](https://github.com/TrigenSoftware/nanoviews/commit/4c2490d58a22f83337496b8e5bb8a896873abc93))
* bottom-up deferred effect scopes ([#189](https://github.com/TrigenSoftware/nanoviews/issues/189)) ([dd3169f](https://github.com/TrigenSoftware/nanoviews/commit/dd3169fbddcffbb3d8000f1f6127e40c37ec2386))
* expose `swap_`, the block `if_` and `switch_` are built on ([#203](https://github.com/TrigenSoftware/nanoviews/issues/203)) ([9fc639f](https://github.com/TrigenSoftware/nanoviews/commit/9fc639f339b97e3518ce0f8e60e12a1628eb9900))
* hand the tracking key to the row ([#217](https://github.com/TrigenSoftware/nanoviews/issues/217)) ([34948cd](https://github.com/TrigenSoftware/nanoviews/commit/34948cdc1b30a15a6400008b77522746f5fa0685))
* let an effect attribute name the element it sits on ([#206](https://github.com/TrigenSoftware/nanoviews/issues/206)) ([215f157](https://github.com/TrigenSoftware/nanoviews/commit/215f157c4070484e0aa2ab00f09add9b0e73d0e4))
* rename `$$children`, `$$slot` and `$$slots` to a trailing `$` ([#209](https://github.com/TrigenSoftware/nanoviews/issues/209)) ([47f794b](https://github.com/TrigenSoftware/nanoviews/commit/47f794b518b53090cd1645dfd1bb2eb981da9c43)), references [#188](https://github.com/TrigenSoftware/nanoviews/issues/188)
* rename `ValueOrAccessor` to `Signalish` ([#210](https://github.com/TrigenSoftware/nanoviews/issues/210)) ([c42723a](https://github.com/TrigenSoftware/nanoviews/commit/c42723a56944cea0f3935b1456a45b607924f0a9))
* rename effect attributes from `$$name` to `name$` ([#188](https://github.com/TrigenSoftware/nanoviews/issues/188)) ([468a293](https://github.com/TrigenSoftware/nanoviews/commit/468a293e6f39ff032618ecc302e21d0b755cbe21))
* rename the truthy and falsy narrowing types ([#211](https://github.com/TrigenSoftware/nanoviews/issues/211)) ([577c49d](https://github.com/TrigenSoftware/nanoviews/commit/577c49d059ff400ac3c8673d4bf414faa739739a))

### Bug Fixes

* apply multi-word and custom style properties ([#195](https://github.com/TrigenSoftware/nanoviews/issues/195)) ([3270183](https://github.com/TrigenSoftware/nanoviews/commit/3270183ca2b2afe591c2ef5d8af3e8ce0a2ee873))
* fire every `on*` prop, not just the bubbling ones ([#204](https://github.com/TrigenSoftware/nanoviews/issues/204)) ([42e613b](https://github.com/TrigenSoftware/nanoviews/commit/42e613b08b72bbabe0c7766780980d452bd1546a))
* let a slot reach `children$` and fail loudly when undeclared ([#10](https://github.com/TrigenSoftware/nanoviews/issues/10)) ([eea8827](https://github.com/TrigenSoftware/nanoviews/commit/eea88271456fd57186fe48fef2fbd77098471474))
* run user reducers and event handlers untracked ([#193](https://github.com/TrigenSoftware/nanoviews/issues/193)) ([03c78db](https://github.com/TrigenSoftware/nanoviews/commit/03c78db4332524c25393098980731c222a938647))
* show the `for_` placeholder when there is no array at all ([#205](https://github.com/TrigenSoftware/nanoviews/issues/205)) ([6e6568b](https://github.com/TrigenSoftware/nanoviews/commit/6e6568bc0afc53838752284937f3b6d74d06e16c))
* type `throw_` as `never` ([#11](https://github.com/TrigenSoftware/nanoviews/issues/11)) ([79a85da](https://github.com/TrigenSoftware/nanoviews/commit/79a85da7be4df3cbc110db287d61ed7d2e85c36f))

### Performance Improvements

* clear a row range with `replaceChildren` ([#216](https://github.com/TrigenSoftware/nanoviews/issues/216)) ([5942baf](https://github.com/TrigenSoftware/nanoviews/commit/5942baf23c5f9d1b0ade019ea87c7e71cc62d2fe))
* create the effect attribute registry on first use ([#213](https://github.com/TrigenSoftware/nanoviews/issues/213)) ([4113217](https://github.com/TrigenSoftware/nanoviews/commit/4113217ab64965346616169fef84176a65a7105e))
* cut allocations and graph work on the binding paths ([#196](https://github.com/TrigenSoftware/nanoviews/issues/196)) ([3d1c93b](https://github.com/TrigenSoftware/nanoviews/commit/3d1c93b987f5ee8e161c42005b07b9ab11a2a63f))
* wake only the rows whose value changed ([#202](https://github.com/TrigenSoftware/nanoviews/issues/202)) ([c71cc9c](https://github.com/TrigenSoftware/nanoviews/commit/c71cc9cfb6e28c4620aa8706be21941ab835b9ce))

## [1.0.0-alpha.9](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews%401.0.0-alpha.8...nanoviews%401.0.0-alpha.9) (2026-07-12)

### Bug Fixes

* support TypeScript 7 ([#156](https://github.com/TrigenSoftware/nano_kit/issues/156)) ([6d9edce](https://github.com/TrigenSoftware/nano_kit/commit/6d9edce57bd709859deb9cf86d9a982ab7cf4a11))

## [1.0.0-alpha.8](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews@1.0.0-alpha.7...nanoviews@1.0.0-alpha.8) (2026-06-09)

### Bug Fixes

* use oxlint ([#135](https://github.com/TrigenSoftware/nano_kit/issues/135)) ([e16f28a](https://github.com/TrigenSoftware/nano_kit/commit/e16f28a22549f911a8c133e83d46a945b05aac85))

## [1.0.0-alpha.7](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews@1.0.0-alpha.6...nanoviews@1.0.0-alpha.7) (2026-05-09)

### Bug Fixes

* fix generated sourcemaps ([cd3457f](https://github.com/TrigenSoftware/nano_kit/commit/cd3457f3c5550266f8b233d35f672febf8dbaa7b))

## [1.0.0-alpha.6](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews@1.0.0-alpha.5...nanoviews@1.0.0-alpha.6) (2026-04-12)

### Features

* move `FalsyValue` type to kida ([52bb15c](https://github.com/TrigenSoftware/nano_kit/commit/52bb15cc82a1759a9219142b62a75a54b1d2b023))
* move `isEmpty` and `subscribeAny` to kida ([3470bbe](https://github.com/TrigenSoftware/nano_kit/commit/3470bbe77908e0438f016fc01f4528cbd5c1f526))

## [1.0.0-alpha.5](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews@1.0.0-alpha.4...nanoviews@1.0.0-alpha.5) (2026-02-15)

### Features

* new naming convention ([d57dde0](https://github.com/TrigenSoftware/nano_kit/commit/d57dde09aaff6069ce17ba4c3b668a87c157f51d))
* sync with updated agera ([f258bdf](https://github.com/TrigenSoftware/nano_kit/commit/f258bdf12e9dcc149873e8badf49f8dcea35490e))

### Bug Fixes

* use new batch and observer apis ([b270a2b](https://github.com/TrigenSoftware/nano_kit/commit/b270a2b468eb1ee3e3c173229b114aff27381c03))

### Performance Improvements

* disable minification ([3d6ad47](https://github.com/TrigenSoftware/nano_kit/commit/3d6ad47eb8cca42002d71f865cd6d136f9eada5a))

## [1.0.0-alpha.4](https://github.com/TrigenSoftware/nano_kit/compare/nanoviews@1.0.0-alpha.3...nanoviews@1.0.0-alpha.4) (2025-11-17)

### Bug Fixes

* use esbuild for minification ([2e48553](https://github.com/TrigenSoftware/nano_kit/commit/2e48553b567e56cc88f68c4a14936b715b1c0577))

## 1.0.0-alpha.3 (2025-11-15)

### Features

* add classList$ effect attribute ([c2b5328](https://github.com/TrigenSoftware/nano_kit/commit/c2b5328c47f320562ceae7d5368cd682e5152dbb))
* migrate kida and nanoviews to agera ([#52](https://github.com/TrigenSoftware/nano_kit/issues/52)) ([382d526](https://github.com/TrigenSoftware/nano_kit/commit/382d526dd3a4d4f1bad2fa29e4fefcf5fd9cab47))
* migrate to @nanoviews/stores ([1dfc895](https://github.com/TrigenSoftware/nano_kit/commit/1dfc8955ed5b7b120d8b47da58b2a8dd3fd9fc64))
* migrate to Kida and major refactoring ([40af9a1](https://github.com/TrigenSoftware/nano_kit/commit/40af9a1615c314d17b9757ccc22b7a383c54026d))
* predefined loop trackers ([823860c](https://github.com/TrigenSoftware/nano_kit/commit/823860cc477353ac0a729d286267934b6af3b3c9))
* remove static values support from controls effect attributes ([c6988d1](https://github.com/TrigenSoftware/nano_kit/commit/c6988d1b9d9e34952939b9b8fab149820c9e43e4))
* support accessors ([6a264ef](https://github.com/TrigenSoftware/nano_kit/commit/6a264efcd17707fa627887fbd08459f7c0ffb21f))

### Bug Fixes

* effect attribute tree-shaking fix ([4fbd3a3](https://github.com/TrigenSoftware/nano_kit/commit/4fbd3a3a7145c5fd3e03137172fd8c56c0f9c1f7))
* remove useless `run` call ([0658340](https://github.com/TrigenSoftware/nano_kit/commit/0658340b8794240f9330f44b477340e97d22a4d0))
