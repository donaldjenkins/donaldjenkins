import { createElementInstance } from './chunk-MULRRSQ4.js';
import { CONNECT, SCOPE } from './chunk-GKRV3IQ4.js';

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/chunks/setup-JDTOOFMN.js
async function setup($el) {
  const parent = findParent($el);
  const ctor = $el.constructor, definition = ctor._definition;
  if (parent) {
    await customElements.whenDefined(parent.localName);
    parent[CONNECT] === true || await new Promise((res) => parent[CONNECT].push(res));
  }
  if ($el.isConnected) {
    const instance = createElementInstance(definition, {
      props: resolvePropsFromAttrs($el),
      scope: parent?.instance[SCOPE]
    });
    if (parent?.keepAlive)
      $el.keepAlive = true;
    $el.attachComponent(instance);
  }
}
function resolvePropsFromAttrs($el) {
  const ctor = $el.constructor, props = {};
  if (!ctor._attrToProp)
    return props;
  for (const attrName of ctor._attrToProp.keys()) {
    if ($el.hasAttribute(attrName)) {
      const propName = ctor._attrToProp.get(attrName);
      const convert = ctor._definition.props[propName].type?.from;
      if (convert) {
        const attrValue = $el.getAttribute(attrName);
        props[propName] = convert(attrValue);
      }
    }
  }
  return props;
}
function findParent($el) {
  let ctor = $el.constructor, node = $el.parentNode, prefix = ctor._definition.tagName.split("-", 1)[0] + "-";
  while (node) {
    if (node.nodeType === 1 && node.localName.startsWith(prefix)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export { setup };
