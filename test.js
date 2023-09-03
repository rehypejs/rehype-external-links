/**
 * @typedef {import('hast').Element} Element
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import rehypeExternalLinks from 'rehype-external-links'

test('rehypeExternalLinks', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-external-links')).sort(),
      ['default']
    )
  })

  await t.test('should not change a relative link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="./example.html">relative</a>')
      ),
      '<a href="./example.html">relative</a>'
    )
  })

  await t.test('should not change a fragment link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="#example">fragment</a>')
      ),
      '<a href="#example">fragment</a>'
    )
  })

  await t.test('should not change a search link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="?search">search</a>')
      ),
      '<a href="?search">search</a>'
    )
  })

  await t.test('should not change a mailto link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="mailto:a@b.com">mailto</a>')
      ),
      '<a href="mailto:a@b.com">mailto</a>'
    )
  })

  await t.test('should change a protocol-relative link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="//example.com">?</a>')
      ),
      '<a href="//example.com" rel="nofollow">?</a>'
    )
  })

  await t.test('should change a http link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="http://example.com">http</a>')
      ),
      '<a href="http://example.com" rel="nofollow">http</a>'
    )
  })

  await t.test('should change a https link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="https://example.com">https</a>')
      ),
      '<a href="https://example.com" rel="nofollow">https</a>'
    )
  })

  await t.test('should not change a www link', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="www.example.com">www</a>')
      ),
      '<a href="www.example.com">www</a>'
    )
  })

  await t.test('should not add a `[target]` by default', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks)
          .process('<a href="http://example.com">http</a>')
      ),
      '<a href="http://example.com" rel="nofollow">http</a>'
    )
  })

  await t.test('should not add a `[rel]` w/ `rel: []`', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks, {rel: []})
          .process('<a href="http://example.com">http</a>')
      ),
      '<a href="http://example.com">http</a>'
    )
  })

  await t.test(
    'should add a `[target]` w/ `target` set to a known target',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {target: '_parent', rel: []})
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" target="_parent">http</a>'
      )
    }
  )

  await t.test(
    'should add a `[rel]` w/ `rel` set to a string',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {rel: 'nofollow'})
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" rel="nofollow">http</a>'
      )
    }
  )

  await t.test(
    'should add a `[rel]` w/ `rel` set to an array',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {rel: ['nofollow']})
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" rel="nofollow">http</a>'
      )
    }
  )

  await t.test(
    'should support `mailto` protocols w/ `mailto` in `protocols`',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {protocols: ['mailto']})
            .process('<a href="mailto:a@b.com">mailto</a>')
        ),
        '<a href="mailto:a@b.com" rel="nofollow">mailto</a>'
      )
    }
  )

  await t.test(
    'should add content at the end of the link w/ `content` as a single child',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              content: {type: 'text', value: ' (opens in a new window)'}
            })
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" rel="nofollow">http<span> (opens in a new window)</span></a>'
      )
    }
  )

  await t.test(
    'should add content at the end of the link w/ `content` as an array of children',
    async function () {
      assert.equal(
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
        '<a href="http://example.com" rel="nofollow">http<span> (<em>opens in a new window</em>)</span></a>'
      )
    }
  )

  await t.test(
    'should add properties to the span at the end of the link w/ `contentProperties`',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              contentProperties: {className: ['alpha', 'bravo']},
              content: {type: 'text', value: ' (opens in a new window)'}
            })
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" rel="nofollow">http<span class="alpha bravo"> (opens in a new window)</span></a>'
      )
    }
  )

  await t.test('should add dynamic `content` to links', async function () {
    assert.equal(
      String(
        await rehype()
          .use({settings: {fragment: true}})
          .use(rehypeExternalLinks, {
            contentProperties: {className: ['alpha', 'bravo']},
            content(node) {
              if (!hasDirectImageChild(node)) {
                return {type: 'text', value: ' (opens in a new window)'}
              }
            }
          })
          .process(
            '<a href="http://example.com">http</a>\n<a href="http://example.com"><img src="./image.png" /></a>'
          )
      ),
      '<a href="http://example.com" rel="nofollow">http<span class="alpha bravo"> (opens in a new window)</span></a>\n<a href="http://example.com" rel="nofollow"><img src="./image.png"></a>'
    )
  })

  await t.test(
    'should add dynamic `contentProperties` to links',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              contentProperties(node) {
                if (!hasDirectImageChild(node)) {
                  return {className: ['alpha', 'bravo']}
                }
              },
              content: {type: 'text', value: ' (opens in a new window)'}
            })
            .process(
              '<a href="http://example.com">http</a>\n<a href="http://example.com"><img src="./image.png" /></a>'
            )
        ),
        '<a href="http://example.com" rel="nofollow">http<span class="alpha bravo"> (opens in a new window)</span></a>\n<a href="http://example.com" rel="nofollow"><img src="./image.png"><span> (opens in a new window)</span></a>'
      )
    }
  )

  await t.test(
    'should add dynamic `target`, `rel` to links',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              target(node) {
                if (!hasDirectImageChild(node)) {
                  return '_blank'
                }
              },
              rel(node) {
                return hasDirectImageChild(node)
                  ? 'nofollow'
                  : ['noopener', 'noreferrer']
              },
              contentProperties: {className: ['alpha', 'bravo']},
              content: {type: 'text', value: ' (opens in a new window)'}
            })
            .process(
              '<a href="http://example.com">http</a>\n<a href="http://example.com"><img src="./image.png" /></a>'
            )
        ),
        '<a href="http://example.com" rel="noopener noreferrer" target="_blank">http<span class="alpha bravo"> (opens in a new window)</span></a>\n<a href="http://example.com" rel="nofollow"><img src="./image.png"><span class="alpha bravo"> (opens in a new window)</span></a>'
      )
    }
  )

  await t.test(
    'should add rel to a link that matches the test function',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              test(node) {
                return node.properties.href === 'http://example.com'
              }
            })
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" rel="nofollow">http</a>'
      )
    }
  )

  await t.test(
    'should not add rel to a link that does not match the test function',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {
              test(node) {
                return node.properties.href === 'http://foobar.com'
              }
            })
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com">http</a>'
      )
    }
  )

  await t.test(
    'should add properties to the link w/ `properties`',
    async function () {
      assert.equal(
        String(
          await rehype()
            .use({settings: {fragment: true}})
            .use(rehypeExternalLinks, {properties: {className: ['external']}})
            .process('<a href="http://example.com">http</a>')
        ),
        '<a href="http://example.com" class="external" rel="nofollow">http</a>'
      )
    }
  )
})

/**
 * @param {Element} node
 *   Element.
 * @returns {boolean}
 *   Whether `node` has a direct `img` child.
 */
function hasDirectImageChild(node) {
  return node.children.some(function (d) {
    return d.type === 'element' && d.tagName === 'img'
  })
}
