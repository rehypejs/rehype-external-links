# rehype-external-links

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to automatically add `target` and `rel` attributes
to external links.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install rehype-external-links
```

## Use

Say we have the following module, `example.js`:

```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'

const input = '[rehype](https://github.com/rehypejs/rehype)'

unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeExternalLinks, {target: false, rel: ['nofollow']})
  .use(rehypeStringify)
  .process(input)
  .then((file) => {
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<p><a href="https://github.com/rehypejs/rehype" rel="nofollow">rehype</a></p>
```

## API

This package exports no identifiers.
The default export is `rehypeExternalLinks`.

### `unified().use(rehypeExternalLinks[, options])`

Automatically add `target` and `rel` attributes to external links.

##### `options`

###### `options.target`

How to display referenced documents (`string?`: `_self`, `_blank`, `_parent`,
or `_top`, default: `_blank`).
Pass `false` to not set `target`s on links.

###### `options.rel`

[Link types][mdn-rel] to hint about the referenced documents (`Array.<string>`
or `string`, default: `['nofollow', 'noopener', 'noreferrer']`).
Pass `false` to not set `rel`s on links.

**Note**: when using a `target`, add [`noopener` and `noreferrer`][mdn-a] to
avoid exploitation of the `window.opener` API.

###### `options.protocols`

Protocols to check, such as `mailto` or `tel` (`Array.<string>`, default:
`['http', 'https']`).

###### `options.content`

[**hast**][hast] content to insert at the end of external links
([**Node**][node] or [**Children**][children]).
Will be inserted in a `<span>` element.

Useful for improving accessibility by [giving users advanced warning when
opening a new window][g201].

###### `options.contentProperties`

[`Properties`][properties] to add to the `span` wrapping `content`, when
given.

## Security

Improper use of `rehype-external-links` can open you up to a
[cross-site scripting (XSS)][xss] attack.

Either do not combine this plugin with user content or use
[`rehype-sanitize`][sanitize].

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

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/rehypejs/rehype-sanitize

[mdn-rel]: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types

[mdn-a]: https://developer.mozilla.org/en/docs/Web/HTML/Element/a

[hast]: https://github.com/syntax-tree/hast

[properties]: https://github.com/syntax-tree/hast#properties

[node]: https://github.com/syntax-tree/hast#nodes

[children]: https://github.com/syntax-tree/unist#child

[g201]: https://www.w3.org/WAI/WCAG21/Techniques/general/G201
