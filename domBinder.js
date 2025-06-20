// domBinder.js

/**
 * DOM Binder Utility
 * Automatically binds DOM elements by ID and querySelectorAll collections.
 * Usage:
 *   import { DOM, bindIds, bindSelectors } from './domBinder.js';
 *   bindIds({ prefix: 'js-' });
 *   bindSelectors({ layoutRadios: 'input[name="layout"]' });
 */

export const DOM = {};

/**
 * Binds all elements with IDs to the DOM object.
 * If a prefix is supplied, it will be stripped from the key name.
 * @param {Object} options
 * @param {string} options.prefix - Optional prefix to remove from ID names
 */
export function bindIds({ prefix = '' } = {}) {
    document.querySelectorAll('[id]').forEach(el => {
        let key = el.id;
        if (prefix && key.startsWith(prefix)) {
            key = key.slice(prefix.length);
        }
        DOM[key] = el;
    });
}

/**
 * Binds custom querySelectorAll selectors to the DOM object.
 * @param {Object} selectors - key: alias, value: CSS selector
 */
export function bindSelectors(selectors) {
    for (const [key, selector] of Object.entries(selectors)) {
        DOM[key] = document.querySelectorAll(selector);
    }
}

/**
 * Optional: clear all DOM bindings (useful for tests or full reloads)
 */
export function clearDOMBindings() {
    for (const key in DOM) {
        delete DOM[key];
    }
}