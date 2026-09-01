# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/TrigenSoftware/nanoviews/compare/v1.0.0-alpha.9...v1.0.0) (2026-09-01)

### Features

* **agera,intl,kida,nanoviews,query,router,svelte-kit:** rename `ValueOrAccessor` to `Signalish` ([#210](https://github.com/TrigenSoftware/nanoviews/issues/210)) ([c42723a](https://github.com/TrigenSoftware/nanoviews/commit/c42723a56944cea0f3935b1456a45b607924f0a9))
* **agera,kida,nanoviews:** bottom-up deferred effect scopes ([#189](https://github.com/TrigenSoftware/nanoviews/issues/189)) ([dd3169f](https://github.com/TrigenSoftware/nanoviews/commit/dd3169fbddcffbb3d8000f1f6127e40c37ec2386))
* **agera,nanoviews:** add `show_` with pausable effect scopes ([#225](https://github.com/TrigenSoftware/nanoviews/issues/225)) ([4c2490d](https://github.com/TrigenSoftware/nanoviews/commit/4c2490d58a22f83337496b8e5bb8a896873abc93))
* **agera:** add `selector` to wake only the keys whose answer changed ([#200](https://github.com/TrigenSoftware/nanoviews/issues/200)) ([ac6b35f](https://github.com/TrigenSoftware/nanoviews/commit/ac6b35f8a18c1e6eb04541d7b8838fe3b712a12f))
* **agera:** derive mounted state from the graph instead of counting subscribers ([#191](https://github.com/TrigenSoftware/nanoviews/issues/191)) ([9c43fce](https://github.com/TrigenSoftware/nanoviews/commit/9c43fcedac7b7a46ac3ce3106bb89ea00f2233f9))
* **agera:** keep the source cold when observing through a derivation ([#199](https://github.com/TrigenSoftware/nanoviews/issues/199)) ([ecc0434](https://github.com/TrigenSoftware/nanoviews/commit/ecc043449ed9d1ee3f5f5b91e6acb8ca95b1c39f))
* **intl:** pass unique index to rich tag handlers to use as framework key ([#187](https://github.com/TrigenSoftware/nanoviews/issues/187)) ([5b4008b](https://github.com/TrigenSoftware/nanoviews/commit/5b4008b2bba8196a66aa5e30e49bde84783cc2a6))
* **intl:** support self-closing tags in rich-text formatter ([#185](https://github.com/TrigenSoftware/nanoviews/issues/185)) ([fa4fcb8](https://github.com/TrigenSoftware/nanoviews/commit/fa4fcb8e64b5afafd1f407328f72f7bf32c3d384))
* **kida,store:** move tasks from `@nano_kit/store` to `kida` ([#220](https://github.com/TrigenSoftware/nanoviews/issues/220)) ([2e5c07c](https://github.com/TrigenSoftware/nanoviews/commit/2e5c07c9ed377856699f33b1ce1deb23d30beba5))
* **nanoviews:** add `as_` to hand a row through a transform ([#207](https://github.com/TrigenSoftware/nanoviews/issues/207)) ([2891ec4](https://github.com/TrigenSoftware/nanoviews/commit/2891ec4987cb2358c235739b430d6445b0325615))
* **nanoviews:** add `match_` for a cascade of conditions ([#219](https://github.com/TrigenSoftware/nanoviews/issues/219)) ([1065b20](https://github.com/TrigenSoftware/nanoviews/commit/1065b204d8e09b1b1cf82353ac7a34d6b1d33e1a))
* **nanoviews:** add `props$` to read any prop in accessor form ([#212](https://github.com/TrigenSoftware/nanoviews/issues/212)) ([3cd1d77](https://github.com/TrigenSoftware/nanoviews/commit/3cd1d7709fc721ae2ff87ccfda648e9d4313758c))
* **nanoviews:** expose `swap_`, the block `if_` and `switch_` are built on ([#203](https://github.com/TrigenSoftware/nanoviews/issues/203)) ([9fc639f](https://github.com/TrigenSoftware/nanoviews/commit/9fc639f339b97e3518ce0f8e60e12a1628eb9900))
* **nanoviews:** hand the tracking key to the row ([#217](https://github.com/TrigenSoftware/nanoviews/issues/217)) ([34948cd](https://github.com/TrigenSoftware/nanoviews/commit/34948cdc1b30a15a6400008b77522746f5fa0685))
* **nanoviews:** let an effect attribute name the element it sits on ([#206](https://github.com/TrigenSoftware/nanoviews/issues/206)) ([215f157](https://github.com/TrigenSoftware/nanoviews/commit/215f157c4070484e0aa2ab00f09add9b0e73d0e4))
* **nanoviews:** rename `$$children`, `$$slot` and `$$slots` to a trailing `$` ([#209](https://github.com/TrigenSoftware/nanoviews/issues/209)) ([47f794b](https://github.com/TrigenSoftware/nanoviews/commit/47f794b518b53090cd1645dfd1bb2eb981da9c43)), references [#188](https://github.com/TrigenSoftware/nanoviews/issues/188)
* **nanoviews:** rename effect attributes from `$$name` to `name$` ([#188](https://github.com/TrigenSoftware/nanoviews/issues/188)) ([468a293](https://github.com/TrigenSoftware/nanoviews/commit/468a293e6f39ff032618ecc302e21d0b755cbe21))
* **nanoviews:** rename the truthy and falsy narrowing types ([#211](https://github.com/TrigenSoftware/nanoviews/issues/211)) ([577c49d](https://github.com/TrigenSoftware/nanoviews/commit/577c49d059ff400ac3c8673d4bf414faa739739a))
* **ssr:** add server entrypoint ([#164](https://github.com/TrigenSoftware/nanoviews/issues/164)) ([eefd560](https://github.com/TrigenSoftware/nanoviews/commit/eefd5606bfdb477409f649be3b34e67d3da7dd91))
* **storybook,storybook-vite,testing-library:** publish the packages and rework the story API ([#5](https://github.com/TrigenSoftware/nanoviews/issues/5)) ([6d72f43](https://github.com/TrigenSoftware/nanoviews/commit/6d72f4354f6ccf206115c14e7d748d4c014d9e65))

### Bug Fixes

* **agera,kida,nanoviews,query:** run user reducers and event handlers untracked ([#193](https://github.com/TrigenSoftware/nanoviews/issues/193)) ([03c78db](https://github.com/TrigenSoftware/nanoviews/commit/03c78db4332524c25393098980731c222a938647))
* **deps:** update dependency magic-string to v1 ([#175](https://github.com/TrigenSoftware/nanoviews/issues/175)) ([fbf537c](https://github.com/TrigenSoftware/nanoviews/commit/fbf537c7d8d77bf99eb05b891fe2ba334de8455f))
* **deps:** update dependency starlight-llms-txt to ^0.11.0 ([#85](https://github.com/TrigenSoftware/nanoviews/issues/85)) ([4ff267b](https://github.com/TrigenSoftware/nanoviews/commit/4ff267bcb05ea354dbf225ae7302518ed818be46))
* **kida:** keep a `resolved` factory unstarted until the first read ([#221](https://github.com/TrigenSoftware/nanoviews/issues/221)) ([bc13a53](https://github.com/TrigenSoftware/nanoviews/commit/bc13a53dc9652b27606a3a0acae5aa319a34d27a))
* **kida:** keep a child write in the caller's context ([#198](https://github.com/TrigenSoftware/nanoviews/issues/198)) ([0816533](https://github.com/TrigenSoftware/nanoviews/commit/0816533769ca523e64fcca760546b22716c89847))
* **kida:** type `toAccessor` by what it actually returns ([#208](https://github.com/TrigenSoftware/nanoviews/issues/208)) ([024e812](https://github.com/TrigenSoftware/nanoviews/commit/024e81231b894245199c1a8962eb709b36513b86))
* **nanoviews:** apply multi-word and custom style properties ([#195](https://github.com/TrigenSoftware/nanoviews/issues/195)) ([3270183](https://github.com/TrigenSoftware/nanoviews/commit/3270183ca2b2afe591c2ef5d8af3e8ce0a2ee873))
* **nanoviews:** fire every `on*` prop, not just the bubbling ones ([#204](https://github.com/TrigenSoftware/nanoviews/issues/204)) ([42e613b](https://github.com/TrigenSoftware/nanoviews/commit/42e613b08b72bbabe0c7766780980d452bd1546a))
* **nanoviews:** let a slot reach `children$` and fail loudly when undeclared ([#10](https://github.com/TrigenSoftware/nanoviews/issues/10)) ([eea8827](https://github.com/TrigenSoftware/nanoviews/commit/eea88271456fd57186fe48fef2fbd77098471474))
* **nanoviews:** show the `for_` placeholder when there is no array at all ([#205](https://github.com/TrigenSoftware/nanoviews/issues/205)) ([6e6568b](https://github.com/TrigenSoftware/nanoviews/commit/6e6568bc0afc53838752284937f3b6d74d06e16c))
* **nanoviews:** type `throw_` as `never` ([#11](https://github.com/TrigenSoftware/nanoviews/issues/11)) ([79a85da](https://github.com/TrigenSoftware/nanoviews/commit/79a85da7be4df3cbc110db287d61ed7d2e85c36f))
* **router:** preserve `statusCode` of loadable `notFound` pages ([#166](https://github.com/TrigenSoftware/nanoviews/issues/166)) ([40da5a6](https://github.com/TrigenSoftware/nanoviews/commit/40da5a6c688e7406242267e1a973f974a0f3843c))

### Performance Improvements

* **agera,kida,store:** replace `morph` with the signal constructor protocol ([#197](https://github.com/TrigenSoftware/nanoviews/issues/197)) ([23b3370](https://github.com/TrigenSoftware/nanoviews/commit/23b337007b4898d5e0d2fc0e4e127a2df71d392e))
* **agera,nanoviews:** cut allocations and graph work on the binding paths ([#196](https://github.com/TrigenSoftware/nanoviews/issues/196)) ([3d1c93b](https://github.com/TrigenSoftware/nanoviews/commit/3d1c93b987f5ee8e161c42005b07b9ab11a2a63f))
* **agera:** speed up effect runs by splitting warmup and rerun paths ([#178](https://github.com/TrigenSoftware/nanoviews/issues/178)) ([f550458](https://github.com/TrigenSoftware/nanoviews/commit/f5504584815c8fe2df16fef44001bccb32ed7574))
* **benchmark-nanoviews:** take the row key and drop `record` ([#218](https://github.com/TrigenSoftware/nanoviews/issues/218)) ([66e9ee3](https://github.com/TrigenSoftware/nanoviews/commit/66e9ee32eac096ffc09d849414bbeb3f7e1abe02))
* **nanoviews:** clear a row range with `replaceChildren` ([#216](https://github.com/TrigenSoftware/nanoviews/issues/216)) ([5942baf](https://github.com/TrigenSoftware/nanoviews/commit/5942baf23c5f9d1b0ade019ea87c7e71cc62d2fe))
* **nanoviews:** create the effect attribute registry on first use ([#213](https://github.com/TrigenSoftware/nanoviews/issues/213)) ([4113217](https://github.com/TrigenSoftware/nanoviews/commit/4113217ab64965346616169fef84176a65a7105e))
* **nanoviews:** wake only the rows whose value changed ([#202](https://github.com/TrigenSoftware/nanoviews/issues/202)) ([c71cc9c](https://github.com/TrigenSoftware/nanoviews/commit/c71cc9cfb6e28c4620aa8706be21941ab835b9ce))
