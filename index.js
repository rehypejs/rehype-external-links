/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Element} Element
 *
 * @typedef {Element['children'][number]} ElementChild
 *
 * @typedef {'_self'|'_blank'|'_parent'|'_top'|false} Target
 * @typedef {Array<string>|string|false} Rel
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
 * @property {Target|TargetCallback} [target='_blank']
 *   How to display referenced documents (`string?`: `_self`, `_blank`,
 *   `_parent`, or `_top`, default: `_blank`).
 *   Pass `false` to not set `target`s on links.
 * @property {Rel|RelCallback} [rel=['nofollow', 'noopener', 'noreferrer']]
 *   Link types to hint about the referenced documents.
 *   Pass `false` to not set `rel`s on links.
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
import absolute from 'is-absolute-url'
import extend from 'extend'

const defaultTarget = '_blank'
const defaultRel = ['nofollow', 'noopener', 'noreferrer']
const defaultProtocols = ['http', 'https']

/**
 *
 * @param {Options[keyof Options]} value
 * @param {Element} node
 */
function createFunction(value, node) {
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

        const target = /** @type {Target} */ (
          createFunction(options.target, node)
        )

        const _rel = /** @type {Rel} */ (createFunction(options.rel, node))
        const rel = typeof _rel === 'string' ? parse(_rel) : _rel

        const protocols =
          /** @type {Protocols} */ (createFunction(options.protocols, node)) ||
          defaultProtocols

        const _content = /** @type {Content} */ (
          createFunction(options.content, node)
        )
        const content =
          _content && !Array.isArray(_content) ? [_content] : _content

        const contentProperties =
          /** @type {ContentProperties} */ (
            createFunction(options.contentProperties, node)
          ) || {}

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
