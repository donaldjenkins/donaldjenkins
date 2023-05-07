import { root, getScope, signal, SCOPE, PROPS, ATTACH, CONNECT, createAccessors, tick, MEMBERS, RENDER, setCustomElementInstance, scoped, onDispose } from './chunk-GKRV3IQ4.js';

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/chunks/chunk-HXFROLDL.js
function createElementInstance(definition, init = {}) {
  return root((dispose) => {
    if (init.scope)
      init.scope.append(getScope());
    let accessors = null, destroyed = false, hasProps = "props" in definition, $props = hasProps ? createInstanceProps(definition.props) : {}, $connected = signal(false), $attrs = {}, $styles = {}, setAttributes = (attrs) => void Object.assign($attrs, attrs), setStyles = (styles) => void Object.assign($styles, styles);
    if (init.props && hasProps) {
      for (const prop of Object.keys(init.props)) {
        if (prop in definition.props)
          $props["$" + prop].set(init.props[prop]);
      }
    }
    const host = {
      [PROPS]: {
        $attrs,
        $styles,
        $connected
      },
      el: null,
      $el() {
        return $connected() ? host.el : null;
      },
      $connected,
      setAttributes,
      setStyles,
      setCSSVars: setStyles
    };
    const instance = {
      host,
      props: $props,
      [SCOPE]: getScope(),
      [PROPS]: $props,
      [ATTACH]: [],
      [CONNECT]: [],
      accessors() {
        if (accessors)
          return accessors;
        const props = {};
        for (const prop of Object.keys(definition.props))
          props[prop] = $props["$" + prop];
        return accessors = createAccessors(props);
      },
      destroy() {
        if (destroyed)
          return;
        destroyed = true;
        host.el?.destroy();
        tick();
        instance[ATTACH].length = 0;
        instance[CONNECT].length = 0;
        dispose();
        instance[SCOPE] = null;
        instance[MEMBERS] = null;
        instance[RENDER] = null;
        host.el = null;
      }
    };
    try {
      setCustomElementInstance(instance);
      instance[MEMBERS] = definition.setup(instance);
    } finally {
      setCustomElementInstance(null);
    }
    const $render = instance[MEMBERS]?.$render;
    if ($render) {
      instance[RENDER] = function render() {
        let result = null;
        scoped(() => {
          try {
            setCustomElementInstance(instance);
            result = $render();
          } finally {
            setCustomElementInstance(null);
          }
        }, instance[SCOPE]);
        return result;
      };
    }
    onDispose(instance.destroy);
    return instance;
  });
}
function createInstanceProps(propDefs) {
  const props = {};
  for (const name of Object.keys(propDefs)) {
    const def = propDefs[name];
    props["$" + name] = signal(def.initial, def);
  }
  return props;
}

export { createElementInstance };
