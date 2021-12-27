# rehype-external-links

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to add `rel` (and `target`) to external links.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeExternalLinks[, options])`](#unifieduserehypeexternallinks-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to add `rel` (and `target`)
attributes to external links.
It is particularly useful when displaying user content on your reputable site,
because users could link to disreputable sources (spam, scams, etc), as search
engines and other bots will discredit your site for linking to them (or
legitimize their sites).
In short: linking to something signals trust, but you can’t trust users.
This plugin adds certain `rel` attributes to prevent that from happening.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that adds `rel` (and `target`) to `<a>`s in the AST.

## When should I use this?

This project is useful when you want to display user content from authors you
don’t trust (such as comments), as they might include links you don’t endorse,
on your website.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-external-links
```

In Deno with [Skypack][]:

```js
import rehypeExternalLinks from 'https://cdn.skypack.dev/rehype-external-links@1?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import rehypeExternalLinks from 'https://cdn.skypack.dev/rehype-external-links@1?min'
</script>
```

## Use

Say our module `example.js` looks as follows:

```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {target: false, rel: ['nofollow']})
    .use(rehypeStringify)
    .process('[rehype](https://github.com/rehypejs/rehype)')

  console.log(String(file))
}
```

Now running `node example.js` yields:

```html
<p><a href="https://github.com/rehypejs/rehype" rel="nofollow">rehype</a></p>
```

## API

This package exports no identifiers.
The default export is `rehypeExternalLinks`.

### `unified().use(rehypeExternalLinks[, options])`

Add `rel` (and `target`) to external links.

##### `options`

Configuration (optional).

###### `options.target`

How to open external documents (`string?`: `_self`, `_blank`, `_parent`,
or `_top`, default: `_blank`).
Pass `false` to not set `target`s on links.

> 👉 **Note**: [you should likely pass `false`][css-tricks].

###### `options.rel`

[Link types][mdn-rel] to hint about the referenced documents (`Array<string>`
or `string`, default: `['nofollow', 'noopener', 'noreferrer']`).
Pass `false` to not set `rel`s on links.

> 👉 **Note**: you should at least set `['nofollow']`.

> ⚠️ **Danger**: when using a `target`, add [`noopener` and `noreferrer`][mdn-a]
> to avoid exploitation of the `window.opener` API.

###### `options.protocols`

Protocols to see as external, such as `mailto` or `tel` (`Array<string>`,
default: `['http', 'https']`).

###### `options.content`

**[hast][]** content to insert at the end of external links ([`Node`][node] or
[`Children`][children], optional).
Will be inserted in a `<span>` element.

> 👉 **Note**: you should set this when using `target` to adhere to
> accessibility guidelines by [giving users advanced warning when opening a new
> window][g201].

###### `options.contentProperties`

Attributes to add to the `<span>`s wrapping `options.content`
([`Properties`][properties], optional).

## Types

This package is fully typed with [TypeScript][].
It exports an `Options` type, which specifies the interface of the accepted
options.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `rehype-parse` version 3+, `rehype-stringify` version 3+,
`rehype` version 4+, and `unified` version 6+.

## Security

Improper use of `rehype-external-links` can open you up to a
[cross-site scripting (XSS)][xss] attack.

Either do not combine this plugin with user content or use
[`rehype-sanitize`][rehype-sanitize].

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-external-links/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-external-links/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-external-links.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-external-links

[downloads-badge]: https://img.shields.io/npm/dm/rehype-external-links.svg

[downloads]: https://www.npmjs.com/package/rehype-external-links

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-external-links.svg

[size]: https://bundlephobia.com/result?p=rehype-external-links

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mdn-rel]: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types

[mdn-a]: https://developer.mozilla.org/en/docs/Web/HTML/Element/a

[hast]: https://github.com/syntax-tree/hast

[properties]: https://github.com/syntax-tree/hast#properties

[node]: https://github.com/syntax-tree/hast#nodes

[children]: https://github.com/syntax-tree/unist#child

[g201]: https://www.w3.org/WAI/WCAG21/Techniques/general/G201

[css-tricks]: https://css-tricks.com/use-target_blank/
