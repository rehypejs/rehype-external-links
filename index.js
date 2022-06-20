/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Element['children'][number]} ElementChild
 *
 * @typedef {Options | ((node: import('hast').Element, tree: Root) => Options)} inputOptions
 *   Configuration as either a function or an object.
 *
 * @typedef Options
 *   Configuration.
 * @property {'_self'|'_blank'|'_parent'|'_top'|false} [target='_blank']
 *   How to display referenced documents (`string?`: `_self`, `_blank`,
 *   `_parent`, or `_top`, default: `_blank`).
 *   Pass `false` to not set `target`s on links.
 * @property {Array<string>|string|false} [rel=['nofollow', 'noopener', 'noreferrer']]
 *   Link types to hint about the referenced documents.
 *   Pass `false` to not set `rel`s on links.
 *
 *   **Note**: when using a `target`, add `noopener` and `noreferrer` to avoid
 *   exploitation of the `window.opener` API.
 * @property {Array<string>} [protocols=['http', 'https']]
 *   Protocols to check, such as `mailto` or `tel`.
 * @property {ElementChild|Array<ElementChild>} [content]
 *   hast content to insert at the end of external links.
 *   Will be inserted in a `<span>` element.
 *
 *   Useful for improving accessibility by giving users advanced warning when
 *   opening a new window.
 * @property {Properties} [contentProperties]
 *   hast properties to add to the `span` wrapping `content`, when given.
 */

import {visit} from 'unist-util-visit'
import {parse} from 'space-separated-tokens'
import absolute from 'is-absolute-url'
import extend from 'extend'

const defaultTarget = '_blank'
const defaultRel = ['nofollow', 'noopener', 'noreferrer']
const defaultProtocols = ['http', 'https']

/**
 * Based on https://stackoverflow.com/a/2970588/12140185
 *
 * @param {string} string_
 * @returns Transforms normal strings to camelCase
 */
function camelCase(string_) {
  return string_
    .replace(/-(.)/g, function ($1) {
      return $1.toUpperCase()
    })
    .replace(/-/g, '')
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase()
    })
}

/**
 * Plugin to automatically add `target` and `rel` attributes to external links.
 *
 * @param {inputOptions} [options = {}]
 * @type {import('unified').Plugin<[inputOptions?] | Array<void>, Root>}
 */
export default function rehypeExternalLinks(options = {}) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string'
      ) {
        const url = node.properties.href
        const protocol = url.slice(0, url.indexOf(':'))

        const options_ =
          typeof options === 'function' ? options(node, tree) : options
        const exclude = options_.exclude || []

        // Rehype camelizes some properties and doesn't for some others, to gurantee compatibility
        // and avoid edge cases, I'm camelizing everything manually,
        const propertyKeys = new Set(
          Object.keys(node.properties).map((x) => camelCase(x))
        )
        const noExcludeProperties = exclude.every(
          (x) => !propertyKeys.has(camelCase(x))
        )
        if (!noExcludeProperties) return

        const target = options_.target
        const rel =
          typeof options_.rel === 'string' ? parse(options_.rel) : options_.rel
        const protocols = options_.protocols || defaultProtocols
        const content =
          options_.content && !Array.isArray(options_.content)
            ? [options_.content]
            : options_.content
        const contentProperties = options_.contentProperties || {}

        if (absolute(url) && protocols.includes(protocol)) {
          if (target !== false) {
            node.properties.target = target || defaultTarget
          }

          if (rel !== false) {
            node.properties.rel = (rel || defaultRel).concat()
          }

          if (content) {
            node.children.push({
              type: 'element',
              tagName: 'span',
              properties: extend(true, contentProperties),
              children: extend(true, content)
            })
          }
        }
      }
    })
  }
}
