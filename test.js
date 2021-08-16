import test from 'tape'
import {rehype} from 'rehype'
import rehypeExternalLinks from './index.js'

test('rehypeExternalLinks', async (t) => {
  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="./example.html">relative</a>')
    ),
    '<a href="./example.html">relative</a>',
    'should not change a relative link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="#example">fragment</a>')
    ),
    '<a href="#example">fragment</a>',
    'should not change a fragment link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="?search">search</a>')
    ),
    '<a href="?search">search</a>',
    'should not change a search link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="mailto:a@b.com">mailto</a>')
    ),
    '<a href="mailto:a@b.com">mailto</a>',
    'should not change a mailto link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_blank" rel="nofollow noopener noreferrer">http</a>',
    'should change a http link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="https://example.com">https</a>')
    ),
    '<a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https</a>',
    'should change a https link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks)
        .process('<a href="www.example.com">www</a>')
    ),
    '<a href="www.example.com">www</a>',
    'should not change a www link'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {target: false})
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" rel="nofollow noopener noreferrer">http</a>',
    'should not add a `[target]` w/ `target: false`'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {rel: false})
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_blank">http</a>',
    'should not add a `[rel]` w/ `rel: false`'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {target: '_parent', rel: false})
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_parent">http</a>',
    'should not add a `[target]` w/ `target` set to a known target'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {target: false, rel: 'nofollow'})
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" rel="nofollow">http</a>',
    'should not add a `[rel]` w/ `rel` set to a string'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {target: false, rel: ['nofollow']})
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" rel="nofollow">http</a>',
    'should not add a `[rel]` w/ `rel` set to an array'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {protocols: ['mailto']})
        .process('<a href="mailto:a@b.com">mailto</a>')
    ),
    '<a href="mailto:a@b.com" target="_blank" rel="nofollow noopener noreferrer">mailto</a>',
    'should support `mailto` protocols w/ `mailto` in `protocols`'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {
          content: {type: 'text', value: ' (opens in a new window)'}
        })
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_blank" rel="nofollow noopener noreferrer">http<span> (opens in a new window)</span></a>',
    'should add content at the end of the link w/ `content` as a single child'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {
          content: [
            {type: 'text', value: ' ('},
            {
              type: 'element',
              tagName: 'em',
              properties: {},
              children: [{type: 'text', value: 'opens in a new window'}]
            },
            {type: 'text', value: ')'}
          ]
        })
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_blank" rel="nofollow noopener noreferrer">http<span> (<em>opens in a new window</em>)</span></a>',
    'should add content at the end of the link w/ `content` as an array of children'
  )

  t.equal(
    String(
      await rehype()
        .use({settings: {fragment: true}})
        .use(rehypeExternalLinks, {
          contentProperties: {className: ['alpha', 'bravo']},
          content: {type: 'text', value: ' (opens in a new window)'}
        })
        .process('<a href="http://example.com">http</a>')
    ),
    '<a href="http://example.com" target="_blank" rel="nofollow noopener noreferrer">http<span class="alpha bravo"> (opens in a new window)</span></a>',
    'should add properties to the span at the end of the link w/ `contentProperties`'
  )

  t.end()
})
