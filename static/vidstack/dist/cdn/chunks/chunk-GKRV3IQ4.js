// ../../node_modules/.pnpm/@maverick-js+signals@5.9.2/node_modules/@maverick-js/signals/dist/dev/chunks/chunk-LO36VLGV.js
var SCOPE = Symbol("SCOPE");
var scheduledEffects = false;
var runningEffects = false;
var currentScope = null;
var currentObserver = null;
var currentObservers = null;
var currentObserversIndex = 0;
var effects = [];
var NOOP = () => {
};
var HANDLERS = Symbol("ERROR_HANDLERS");
var STATE_CLEAN = 0;
var STATE_CHECK = 1;
var STATE_DIRTY = 2;
var STATE_DISPOSED = 3;
function flushEffects() {
  scheduledEffects = true;
  queueMicrotask(runEffects);
}
function runEffects() {
  if (!effects.length) {
    scheduledEffects = false;
    return;
  }
  runningEffects = true;
  for (let i = 0; i < effects.length; i++) {
    if (effects[i]._state !== STATE_CLEAN)
      runTop(effects[i]);
  }
  effects = [];
  scheduledEffects = false;
  runningEffects = false;
}
function runTop(node) {
  let ancestors = [node];
  while (node = node[SCOPE]) {
    if (node._state !== STATE_CLEAN)
      ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    updateCheck(ancestors[i]);
  }
}
function root(init) {
  const scope = createScope();
  return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null);
}
function peek(compute2) {
  const prev = currentObserver;
  currentObserver = null;
  const result = compute2();
  currentObserver = prev;
  return result;
}
function untrack(compute2) {
  const prev = currentScope;
  currentScope = null;
  const result = peek(compute2);
  currentScope = prev;
  return result;
}
function tick() {
  if (!runningEffects)
    runEffects();
}
function getScope() {
  return currentScope;
}
function scoped(run, scope) {
  try {
    return compute(scope, run, null);
  } catch (error) {
    handleError(scope, error);
    return;
  }
}
function getContext(key, scope = currentScope) {
  return lookup(scope, key);
}
function setContext(key, value, scope = currentScope) {
  if (scope)
    (scope._context ?? (scope._context = {}))[key] = value;
}
function onDispose(disposable) {
  if (!disposable || !currentScope)
    return disposable || NOOP;
  const node = currentScope;
  if (!node._disposal) {
    node._disposal = disposable;
  } else if (Array.isArray(node._disposal)) {
    node._disposal.push(disposable);
  } else {
    node._disposal = [node._disposal, disposable];
  }
  return function removeDispose() {
    if (node._state === STATE_DISPOSED)
      return;
    disposable.call(null);
    if (isFunction(node._disposal)) {
      node._disposal = null;
    } else if (Array.isArray(node._disposal)) {
      node._disposal.splice(node._disposal.indexOf(disposable), 1);
    }
  };
}
var scopes = [];
function dispose(self = true) {
  if (this._state === STATE_DISPOSED)
    return;
  let current = self ? this : this._nextSibling, head = self ? this._prevSibling : this;
  if (current) {
    scopes.push(this);
    do {
      current._state = STATE_DISPOSED;
      if (current._disposal)
        emptyDisposal(current);
      if (current._sources)
        removeSourceObservers(current, 0);
      if (current._prevSibling)
        current._prevSibling._nextSibling = null;
      current[SCOPE] = null;
      current._sources = null;
      current._observers = null;
      current._prevSibling = null;
      current._context = null;
      scopes.push(current);
      current = current._nextSibling;
    } while (current && scopes.includes(current[SCOPE]));
  }
  if (head)
    head._nextSibling = current;
  if (current)
    current._prevSibling = head;
  scopes = [];
}
function emptyDisposal(scope) {
  try {
    if (Array.isArray(scope._disposal)) {
      for (let i = 0; i < scope._disposal.length; i++) {
        const callable = scope._disposal[i];
        callable.call(callable);
      }
    } else {
      scope._disposal.call(scope._disposal);
    }
    scope._disposal = null;
  } catch (error) {
    handleError(scope, error);
  }
}
function compute(scope, compute2, observer) {
  const prevScope = currentScope, prevObserver = currentObserver;
  currentScope = scope;
  currentObserver = observer;
  try {
    return compute2.call(scope);
  } finally {
    currentScope = prevScope;
    currentObserver = prevObserver;
  }
}
function lookup(scope, key) {
  if (!scope)
    return;
  let current = scope, value;
  while (current) {
    value = current._context?.[key];
    if (value !== void 0)
      return value;
    current = current[SCOPE];
  }
}
function handleError(scope, error, depth) {
  const handlers = lookup(scope, HANDLERS);
  if (!handlers)
    throw error;
  try {
    const coercedError = error instanceof Error ? error : Error(JSON.stringify(error));
    for (const handler of handlers)
      handler(coercedError);
  } catch (error2) {
    handleError(scope[SCOPE], error2);
  }
}
function read() {
  if (this._state === STATE_DISPOSED)
    return this._value;
  if (currentObserver && !this._effect) {
    if (!currentObservers && currentObserver._sources && currentObserver._sources[currentObserversIndex] == this) {
      currentObserversIndex++;
    } else if (!currentObservers)
      currentObservers = [this];
    else
      currentObservers.push(this);
  }
  if (this._compute)
    updateCheck(this);
  return this._value;
}
function write(newValue) {
  const value = isFunction(newValue) ? newValue(this._value) : newValue;
  if (this._changed(this._value, value)) {
    this._value = value;
    if (this._observers) {
      for (let i = 0; i < this._observers.length; i++) {
        notify(this._observers[i], STATE_DIRTY);
      }
    }
  }
  return this._value;
}
var ScopeNode = function Scope() {
  this[SCOPE] = null;
  this._nextSibling = null;
  this._prevSibling = null;
  if (currentScope)
    currentScope.append(this);
};
var ScopeProto = ScopeNode.prototype;
ScopeProto._context = null;
ScopeProto._compute = null;
ScopeProto._disposal = null;
ScopeProto.append = function appendScope(scope) {
  scope[SCOPE] = this;
  scope._prevSibling = this;
  if (this._nextSibling)
    this._nextSibling._prevSibling = scope;
  scope._nextSibling = this._nextSibling;
  this._nextSibling = scope;
};
function createScope() {
  return new ScopeNode();
}
var ComputeNode = function Computation(initialValue, compute2, options) {
  ScopeNode.call(this);
  this._state = compute2 ? STATE_DIRTY : STATE_CLEAN;
  this._init = false;
  this._effect = false;
  this._sources = null;
  this._observers = null;
  this._value = initialValue;
  this.id = options?.id ?? (this._compute ? "computed" : "signal");
  if (compute2)
    this._compute = compute2;
  if (options && options.dirty)
    this._changed = options.dirty;
};
var ComputeProto = ComputeNode.prototype;
Object.setPrototypeOf(ComputeProto, ScopeProto);
ComputeProto._changed = isNotEqual;
ComputeProto.call = read;
function createComputation(initialValue, compute2, options) {
  return new ComputeNode(initialValue, compute2, options);
}
function isNotEqual(a, b) {
  return a !== b;
}
function isFunction(value) {
  return typeof value === "function";
}
function updateCheck(node) {
  if (node._state === STATE_CHECK) {
    for (let i = 0; i < node._sources.length; i++) {
      updateCheck(node._sources[i]);
      if (node._state === STATE_DIRTY) {
        break;
      }
    }
  }
  if (node._state === STATE_DIRTY)
    update(node);
  else
    node._state = STATE_CLEAN;
}
function cleanup(node) {
  if (node._nextSibling && node._nextSibling[SCOPE] === node)
    dispose.call(node, false);
  if (node._disposal)
    emptyDisposal(node);
  if (node._context && node._context[HANDLERS])
    node._context[HANDLERS] = [];
}
function update(node) {
  let prevObservers = currentObservers, prevObserversIndex = currentObserversIndex;
  currentObservers = null;
  currentObserversIndex = 0;
  try {
    cleanup(node);
    const result = compute(node, node._compute, node);
    if (currentObservers) {
      if (node._sources)
        removeSourceObservers(node, currentObserversIndex);
      if (node._sources && currentObserversIndex > 0) {
        node._sources.length = currentObserversIndex + currentObservers.length;
        for (let i = 0; i < currentObservers.length; i++) {
          node._sources[currentObserversIndex + i] = currentObservers[i];
        }
      } else {
        node._sources = currentObservers;
      }
      let source;
      for (let i = currentObserversIndex; i < node._sources.length; i++) {
        source = node._sources[i];
        if (!source._observers)
          source._observers = [node];
        else
          source._observers.push(node);
      }
    } else if (node._sources && currentObserversIndex < node._sources.length) {
      removeSourceObservers(node, currentObserversIndex);
      node._sources.length = currentObserversIndex;
    }
    if (!node._effect && node._init) {
      write.call(node, result);
    } else {
      node._value = result;
      node._init = true;
    }
  } catch (error) {
    if (!node._init && typeof node._value === "undefined") {
      console.error(
        `computed \`${node.id}\` threw error during first run, this can be fatal.

Solutions:

1. Set the \`initial\` option to silence this error`,
        "\n2. Or, use an `effect` if the return value is not being used",
        "\n\n",
        error
      );
    }
    handleError(node, error);
    if (node._state === STATE_DIRTY) {
      cleanup(node);
      if (node._sources)
        removeSourceObservers(node, 0);
    }
    return;
  }
  currentObservers = prevObservers;
  currentObserversIndex = prevObserversIndex;
  node._state = STATE_CLEAN;
}
function notify(node, state) {
  if (node._state >= state)
    return;
  if (node._effect && node._state === STATE_CLEAN) {
    effects.push(node);
    if (!scheduledEffects)
      flushEffects();
  }
  node._state = state;
  if (node._observers) {
    for (let i = 0; i < node._observers.length; i++) {
      notify(node._observers[i], STATE_CHECK);
    }
  }
}
function removeSourceObservers(node, index) {
  let source, swap;
  for (let i = index; i < node._sources.length; i++) {
    source = node._sources[i];
    if (source._observers) {
      swap = source._observers.indexOf(node);
      source._observers[swap] = source._observers[source._observers.length - 1];
      source._observers.pop();
    }
  }
}
function signal(initialValue, options) {
  const node = createComputation(initialValue, null, options), signal2 = read.bind(node);
  signal2.node = node;
  signal2.set = write.bind(node);
  return signal2;
}
function computed(compute2, options) {
  {
    const node = createComputation(
      options?.initial,
      compute2,
      options
    );
    const signal2 = read.bind(node);
    signal2.node = node;
    return signal2;
  }
}
function effect(effect22, options) {
  const signal2 = createComputation(
    null,
    function runEffect() {
      let effectResult = effect22();
      isFunction(effectResult) && onDispose(effectResult);
      return null;
    },
    { id: options?.id ?? "effect" }
  );
  signal2._effect = true;
  update(signal2);
  {
    return function stopEffect() {
      dispose.call(signal2, true);
    };
  }
}

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/chunks/chunk-D2IDN6VA.js
function createAccessors(record) {
  const accessors = {};
  for (const name of Object.keys(record)) {
    Object.defineProperty(accessors, name, {
      configurable: true,
      enumerable: true,
      get: record[name],
      set: record[name].set
    });
  }
  return accessors;
}
function noop(...args) {
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function isNil(value) {
  return isNull(value) || isUndefined(value);
}
function isObject(value) {
  return value?.constructor === Object;
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isString(value) {
  return typeof value === "string";
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function isFunction2(value) {
  return typeof value === "function";
}
function isArray(value) {
  return Array.isArray(value);
}
function createRegex(regex) {
  return isString(regex) ? new RegExp(regex) : regex;
}
function isWindow(value) {
  return value === window;
}
function createStore(initial) {
  const descriptors = Object.getOwnPropertyDescriptors(initial);
  return {
    initial,
    create: () => {
      const store = {};
      for (const name of Object.keys(initial)) {
        const $value = descriptors[name].get || signal(initial[name]);
        Object.defineProperty(store, name, {
          configurable: true,
          enumerable: true,
          get: $value,
          set: $value.set
        });
      }
      return store;
    },
    reset: (record, filter) => {
      for (const name of Object.keys(record)) {
        if (!descriptors[name].get && (!filter || filter(name))) {
          record[name] = initial[name];
        }
      }
    }
  };
}
var effect2 = effect;
function unwrap(fn) {
  return isFunction2(fn) ? fn() : fn;
}
function unwrapDeep(fn) {
  let value = fn;
  while (typeof value === "function")
    value = value();
  return value;
}
function createContext(provide) {
  return { id: Symbol(), provide };
}
function provideContext(context, value, scope = getScope()) {
  if (!scope) {
    throw Error("[maverick] attempting to provide context outside `root` or `setup` function");
  }
  const hasProvidedValue = !isUndefined(value);
  if (!hasProvidedValue && !context.provide) {
    throw Error("[maverick] context can not be provided without a value or `provide` function");
  }
  setContext(context.id, hasProvidedValue ? value : context.provide?.(), scope);
}
function useContext(context) {
  const value = getContext(context.id);
  if (isUndefined(value)) {
    throw Error("[maverick] attempting to use context without providing first");
  }
  return value;
}

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/chunks/chunk-BKACTARQ.js
var _instances = [null];
function getCustomElementInstance() {
  return _instances[_instances.length - 1];
}
function setCustomElementInstance(host) {
  if (!host) {
    _instances.pop();
    return;
  }
  _instances.push(host);
}
var HOST = /* @__PURE__ */ Symbol("HOST");
var PROPS = /* @__PURE__ */ Symbol("PROPS");
var MEMBERS = /* @__PURE__ */ Symbol("MEMBERS");
var RENDER = /* @__PURE__ */ Symbol("RENDER");
var ATTACH = /* @__PURE__ */ Symbol("ATTACH");
var CONNECT = /* @__PURE__ */ Symbol("CONNECT");

export { ATTACH, CONNECT, HOST, MEMBERS, PROPS, RENDER, SCOPE, computed, createAccessors, createContext, createRegex, createStore, effect, effect2, getCustomElementInstance, getScope, isArray, isBoolean, isFunction, isFunction2, isNil, isNull, isNumber, isObject, isString, isUndefined, isWindow, noop, onDispose, peek, provideContext, root, scoped, setCustomElementInstance, signal, tick, untrack, unwrap, unwrapDeep, useContext };
