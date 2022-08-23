/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Element} Element
 *
 * @typedef {Element['children'][number]} ElementChild
 *
 * @typedef {'_self'|'_blank'|'_parent'|'_top'} Target
 * @typedef {Array<string>|string} Rel
 * @typedef {Array<string>} Protocols
 * @typedef {ElementChild|Array<ElementChild>} Content
 * @typedef {Properties} ContentProperties
 *
 * @callback TargetCallback
 * @param {Element} node
 * @returns {Target|null|undefined}
 *
 * @callback RelCallback
 * @param {Element} node
 * @returns {Rel|null|undefined}
 *
 * @callback ProtocolsCallback
 * @param {Element} node
 * @returns {Protocols|null|undefined}
 *
 * @callback ContentCallback
 * @param {Element} node
 * @returns {Content|null|undefined}
 *
 * @callback ContentPropertiesCallback
 * @param {Element} node
 * @returns {Properties|null|undefined}
 *
 * @typedef Options
 *   Configuration.
 * @property {Target|TargetCallback} [target]
 *   How to display referenced documents (`string?`: `_self`, `_blank`,
 *   `_parent`, or `_top`, default: `_blank`).
 *   The default (nothing) is to not set `target`s on links.
 * @property {Rel|RelCallback} [rel=['nofollow', 'noopener', 'noreferrer']]
 *   Link types to hint about the referenced documents.
 *   Pass an empty array (`[]`) to not set `rel`s on links.
 *
 *   **Note**: when using a `target`, add `noopener` and `noreferrer` to avoid
 *   exploitation of the `window.opener` API.
 * @property {Protocols|ProtocolsCallback} [protocols=['http', 'https']]
 *   Protocols to check, such as `mailto` or `tel`.
 * @property {Content|ContentCallback} [content]
 *   hast content to insert at the end of external links.
 *   Will be inserted in a `<span>` element.
 *
 *   Useful for improving accessibility by giving users advanced warning when
 *   opening a new window.
 * @property {ContentProperties|ContentPropertiesCallback} [contentProperties]
 *   hast properties to add to the `span` wrapping `content`, when given.
 */

import {visit} from 'unist-util-visit'
import {parse} from 'space-separated-tokens'
import isAbsoluteUrl from 'is-absolute-url'
import extend from 'extend'

const defaultRel = ['nofollow']
const defaultProtocols = ['http', 'https']

/**
 * If this is a value, return that.
 * If this is a function instead, call it to get the result.
 *
 * @template T
 * @param {T} value
 * @param {Element} node
 * @returns {T extends Function ? ReturnType<T> : T}
 */
function callIfNeeded(value, node) {
  return typeof value === 'function' ? value(node) : value
}

/**
 * Plugin to automatically add `target` and `rel` attributes to external links.
 *
 * @type {import('unified').Plugin<[Options?] | Array<void>, Root>}
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

        const target = callIfNeeded(options.target, node)

        const relRaw = callIfNeeded(options.rel, node) || defaultRel
        const rel = typeof relRaw === 'string' ? parse(relRaw) : relRaw

        const protocols =
          callIfNeeded(options.protocols, node) || defaultProtocols

        const contentRaw = callIfNeeded(options.content, node)
        const content =
          contentRaw && !Array.isArray(contentRaw) ? [contentRaw] : contentRaw

        const contentProperties =
          callIfNeeded(options.contentProperties, node) || {}

        if (
          isAbsoluteUrl(url)
            ? protocols.includes(protocol)
            : url.startsWith('//')
        ) {
          if (target) {
            node.properties.target = target
          }

          if (rel.length > 0) {
            node.properties.rel = rel.concat()
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
