import { ParseError, ParseErrorCode } from './chunk-YOLHXCNI.js';
import { parseVTTTimestamp } from './chunk-UMPGLVMI.js';

// ../../node_modules/.pnpm/media-captions@0.0.8/node_modules/media-captions/dist/dev.js
var LINE_TERMINATOR_RE = /\r?\n|\r/gm;
var TextLineTransformStream = class {
  constructor(encoding) {
    const transformer = new TextStreamLineIterator(encoding);
    this.writable = new WritableStream({
      write(chunk) {
        transformer.transform(chunk);
      },
      close() {
        transformer.close();
      }
    });
    this.readable = new ReadableStream({
      start(controller) {
        transformer.onLine = (line) => controller.enqueue(line);
        transformer.onClose = () => controller.close();
      }
    });
  }
};
var TextStreamLineIterator = class {
  constructor(encoding) {
    this._buffer = "";
    this._decoder = new TextDecoder(encoding);
  }
  transform(chunk) {
    this._buffer += this._decoder.decode(chunk, { stream: true });
    const lines = this._buffer.split(LINE_TERMINATOR_RE);
    this._buffer = lines.pop() || "";
    for (let i = 0; i < lines.length; i++)
      this.onLine(lines[i].trim());
  }
  close() {
    if (this._buffer)
      this.onLine(this._buffer.trim());
    this._buffer = "";
    this.onClose();
  }
};
async function parseText(text, options) {
  const stream = new ReadableStream({
    start(controller) {
      const lines = text.split(LINE_TERMINATOR_RE);
      for (const line of lines)
        controller.enqueue(line);
      controller.close();
    }
  });
  return parseTextStream(stream, options);
}
async function parseTextStream(stream, options) {
  const type = options?.type ?? "vtt";
  let factory;
  if (typeof type === "string") {
    switch (type) {
      case "srt":
        factory = (await import('./parse-ZLFM5JS3-PMSP7CQB.js')).default;
        break;
      case "ssa":
      case "ass":
        factory = (await import('./parse-VS4JCP7M-FYAH3BR6.js')).default;
        break;
      default:
        factory = (await import('./parse-VRKH2NXJ-XMGLOPJV.js')).default;
    }
  } else {
    factory = type;
  }
  let result;
  const reader = stream.getReader(), parser = factory(), errors = options?.errors !== false || !!options?.strict || !!options?.errors;
  await parser.init({
    strict: false,
    ...options,
    errors,
    type,
    cancel() {
      reader.cancel();
      result = parser.done(true);
    }
  });
  let i = 1;
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      parser.parse("", i);
      result = parser.done(false);
      break;
    }
    parser.parse(value, i);
    i++;
  }
  return result;
}
async function parseResponse(response, options) {
  const res = await response;
  if (!res.ok || !res.body) {
    let error;
    {
      error = new ParseError({
        code: ParseErrorCode.LoadFail,
        reason: !res.ok ? `response is not ok (status: ${res.status})` : `response body is missing (status: ${res.status})`,
        line: -1
      });
      options?.onError?.(error);
    }
    return {
      metadata: {},
      cues: [],
      regions: [],
      errors: [error]
    };
  }
  const contentType = res.headers.get("content-type") || "", type = contentType.match(/text\/(.*?)(?:;|$)/)?.[1], encoding = contentType.match(/charset=(.*?)(?:;|$)/)?.[1];
  return parseByteStream(res.body, { type, encoding, ...options });
}
async function parseByteStream(stream, { encoding = "utf-8", ...options } = {}) {
  const textStream = stream.pipeThrough(new TextLineTransformStream(encoding));
  return parseTextStream(textStream, options);
}
var DIGIT_RE = /[0-9]/;
var MULTI_SPACE_RE = /[\s\t]+/;
var TAG_NAME = {
  c: "span",
  i: "i",
  b: "b",
  u: "u",
  ruby: "ruby",
  rt: "rt",
  v: "span",
  lang: "span",
  timestamp: "span"
};
var HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": "\xA0",
  "&lrm;": "\u200E",
  "&rlm;": "\u200F"
};
var HTML_ENTITY_RE = /&(?:amp|lt|gt|quot|#(0+)?39|nbsp|lrm|rlm);/g;
var COLORS = /* @__PURE__ */ new Set([
  "white",
  "lime",
  "cyan",
  "red",
  "yellow",
  "magenta",
  "blue",
  "black"
]);
var BLOCK_TYPES = /* @__PURE__ */ new Set(Object.keys(TAG_NAME));
function tokenizeVTTCue(cue) {
  let buffer = "", mode = 1, result = [], stack = [], node;
  for (let i = 0; i < cue.text.length; i++) {
    const char = cue.text[i];
    switch (mode) {
      case 1:
        if (char === "<") {
          addText();
          mode = 2;
        } else {
          buffer += char;
        }
        break;
      case 2:
        switch (char) {
          case "\n":
          case "	":
          case " ":
            addNode();
            mode = 4;
            break;
          case ".":
            addNode();
            mode = 3;
            break;
          case "/":
            mode = 5;
            break;
          case ">":
            addNode();
            mode = 1;
            break;
          default:
            if (!buffer && DIGIT_RE.test(char))
              mode = 6;
            buffer += char;
            break;
        }
        break;
      case 3:
        switch (char) {
          case "	":
          case " ":
          case "\n":
            addClass();
            if (node)
              node.class?.trim();
            mode = 4;
            break;
          case ".":
            addClass();
            break;
          case ">":
            addClass();
            if (node)
              node.class?.trim();
            mode = 1;
            break;
          default:
            buffer += char;
        }
        break;
      case 4:
        if (char === ">") {
          buffer = buffer.replace(MULTI_SPACE_RE, " ");
          if (node?.type === "v")
            node.voice = replaceHTMLEntities(buffer);
          else if (node?.type === "lang")
            node.lang = replaceHTMLEntities(buffer);
          buffer = "";
          mode = 1;
        } else {
          buffer += char;
        }
        break;
      case 5:
        if (char === ">") {
          buffer = "";
          node = stack.pop();
          mode = 1;
        }
        break;
      case 6:
        if (char === ">") {
          const time = parseVTTTimestamp(buffer);
          if (time !== null && time >= cue.startTime && time <= cue.endTime) {
            buffer = "timestamp";
            addNode();
            node.time = time;
          }
          buffer = "";
          mode = 1;
        } else {
          buffer += char;
        }
        break;
    }
  }
  function addNode() {
    if (BLOCK_TYPES.has(buffer)) {
      const parent = node;
      node = createBlockNode(buffer);
      if (parent) {
        if (stack[stack.length - 1] !== parent)
          stack.push(parent);
        parent.children.push(node);
      } else
        result.push(node);
    }
    buffer = "";
    mode = 1;
  }
  function addClass() {
    if (node && buffer) {
      const color = buffer.replace("bg_", "");
      if (COLORS.has(color)) {
        node[buffer.startsWith("bg_") ? "bgColor" : "color"] = color;
      } else {
        node.class = !node.class ? buffer : node.class + " " + buffer;
      }
    }
    buffer = "";
  }
  function addText() {
    if (!buffer)
      return;
    const text = { type: "text", data: replaceHTMLEntities(buffer) };
    node ? node.children.push(text) : result.push(text);
    buffer = "";
  }
  if (mode === 1)
    addText();
  return result;
}
function createBlockNode(type) {
  return {
    tagName: TAG_NAME[type],
    type,
    children: []
  };
}
function replaceHTMLEntities(text) {
  return text.replace(HTML_ENTITY_RE, (entity) => HTML_ENTITIES[entity] || "'");
}
function setCSSVar(el, name, value) {
  el.style.setProperty(`--${name}`, value + "");
}
function setDataAttr(el, name, value = true) {
  el.setAttribute(`data-${name}`, value === true ? "" : value + "");
}
function setPartAttr(el, name) {
  el.setAttribute("part", name);
}
function getLineHeight(el) {
  return parseFloat(getComputedStyle(el).lineHeight) || 0;
}
function createVTTCueTemplate(cue) {
  const template = document.createElement("template");
  template.innerHTML = renderVTTCueString(cue);
  return { cue, content: template.content };
}
function renderVTTCueString(cue, currentTime = 0) {
  return renderVTTTokensString(tokenizeVTTCue(cue), currentTime);
}
function renderVTTTokensString(tokens, currentTime = 0) {
  let attrs, result = "";
  for (const token of tokens) {
    if (token.type === "text") {
      result += token.data;
    } else {
      const isTimestamp = token.type === "timestamp";
      attrs = {};
      attrs.class = token.class;
      attrs.title = token.type === "v" && token.voice;
      attrs.lang = token.type === "lang" && token.lang;
      attrs["part"] = token.type === "v" && "voice";
      if (isTimestamp) {
        attrs["part"] = "timed";
        attrs["data-time"] = token.time;
        attrs["data-future"] = token.time > currentTime;
        attrs["data-past"] = token.time < currentTime;
      }
      attrs.style = `${token.color ? `color: ${token.color};` : ""}${token.bgColor ? `background-color: ${token.bgColor};` : ""}`;
      const attributes = Object.entries(attrs).filter((v) => v[1]).map((v) => `${v[0]}="${v[1] === true ? "" : v[1]}"`).join(" ");
      result += `<${token.tagName}${attributes ? " " + attributes : ""}>${renderVTTTokensString(
        token.children
      )}</${token.tagName}>`;
    }
  }
  return result;
}
function updateTimedVTTCueNodes(root, currentTime) {
  for (const el of root.querySelectorAll('[part="timed"]')) {
    const time = Number(el.getAttribute("data-time"));
    if (Number.isNaN(time))
      continue;
    if (time > currentTime)
      setDataAttr(el, "future");
    else
      el.removeAttribute("data-future");
    if (time < currentTime)
      setDataAttr(el, "past");
    else
      el.removeAttribute("data-past");
  }
}
var STARTING_BOX = Symbol("STARTING_BOX" );
function createBox(box) {
  if (box instanceof HTMLElement) {
    return {
      top: box.offsetTop,
      width: box.clientWidth,
      height: box.clientHeight,
      left: box.offsetLeft,
      right: box.offsetLeft + box.clientWidth,
      bottom: box.offsetTop + box.clientHeight
    };
  }
  return { ...box };
}
function moveBox(box, axis, delta) {
  switch (axis) {
    case "+x":
      box.left += delta;
      box.right += delta;
      break;
    case "-x":
      box.left -= delta;
      box.right -= delta;
      break;
    case "+y":
      box.top += delta;
      box.bottom += delta;
      break;
    case "-y":
      box.top -= delta;
      box.bottom -= delta;
      break;
  }
}
function isBoxCollision(a, b) {
  return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
}
function isAnyBoxCollision(box, boxes) {
  for (let i = 0; i < boxes.length; i++)
    if (isBoxCollision(box, boxes[i]))
      return boxes[i];
  return null;
}
function isWithinBox(container, box) {
  return box.top >= 0 && box.bottom <= container.height && box.left >= 0 && box.right <= container.width;
}
function isBoxOutOfBounds(container, box, axis) {
  switch (axis) {
    case "+x":
      return box.left < 0;
    case "-x":
      return box.right > container.width;
    case "+y":
      return box.top < 0;
    case "-y":
      return box.bottom > container.height;
  }
}
function calcBoxIntersectPercentage(container, box) {
  const x = Math.max(0, Math.min(container.width, box.right) - Math.max(0, box.left)), y = Math.max(0, Math.min(container.height, box.bottom) - Math.max(0, box.top)), intersectArea = x * y;
  return intersectArea / (container.height * container.width);
}
function createCSSBox(container, box) {
  return {
    top: box.top / container.height,
    left: box.left / container.width,
    right: (container.width - box.right) / container.width,
    bottom: (container.height - box.bottom) / container.height
  };
}
function resolveRelativeBox(container, box) {
  box.top = box.top * container.height;
  box.left = box.left * container.width;
  box.right = container.width - box.right * container.width;
  box.bottom = container.height - box.bottom * container.height;
  return box;
}
var BOX_SIDES = ["top", "left", "right", "bottom"];
function setBoxCSSVars(el, container, box, prefix) {
  const cssBox = createCSSBox(container, box);
  for (const side of BOX_SIDES) {
    setCSSVar(el, `${prefix}-${side}`, cssBox[side] * 100 + "%");
  }
}
function avoidBoxCollisions(container, box, boxes, axis) {
  let percentage = 1, positionedBox, startBox = { ...box };
  for (let i = 0; i < axis.length; i++) {
    while (isBoxOutOfBounds(container, box, axis[i]) || isWithinBox(container, box) && isAnyBoxCollision(box, boxes)) {
      moveBox(box, axis[i], 1);
    }
    if (isWithinBox(container, box))
      return box;
    const intersection = calcBoxIntersectPercentage(container, box);
    if (percentage > intersection) {
      positionedBox = { ...box };
      percentage = intersection;
    }
    box = { ...startBox };
  }
  return positionedBox || startBox;
}
var POSITION_OVERRIDE = Symbol("POSITION_OVERRIDE" );
function positionCue(container, cue, displayEl, boxes) {
  let cueEl = displayEl.firstElementChild, line = computeCueLine(cue), displayBox, axis = [];
  if (!displayEl[STARTING_BOX]) {
    displayEl[STARTING_BOX] = createStartingBox(container, displayEl);
  }
  displayBox = resolveRelativeBox(container, { ...displayEl[STARTING_BOX] });
  if (displayEl[POSITION_OVERRIDE]) {
    axis = [displayEl[POSITION_OVERRIDE] === "top" ? "+y" : "-y", "+x", "-x"];
  } else if (cue.snapToLines) {
    let size;
    switch (cue.vertical) {
      case "":
        axis = ["+y", "-y"];
        size = "height";
        break;
      case "rl":
        axis = ["+x", "-x"];
        size = "width";
        break;
      case "lr":
        axis = ["-x", "+x"];
        size = "width";
        break;
    }
    let step = getLineHeight(cueEl), position = step * Math.round(line), maxPosition = container[size] + step, initialAxis = axis[0];
    if (Math.abs(position) > maxPosition) {
      position = position < 0 ? -1 : 1;
      position *= Math.ceil(maxPosition / step) * step;
    }
    if (line < 0) {
      position += cue.vertical === "" ? container.height : container.width;
      axis = axis.reverse();
    }
    moveBox(displayBox, initialAxis, position);
  } else {
    const isHorizontal = cue.vertical === "", posAxis = isHorizontal ? "+y" : "+x", size = isHorizontal ? displayBox.height : displayBox.width;
    moveBox(
      displayBox,
      posAxis,
      (isHorizontal ? container.height : container.width) * line / 100
    );
    moveBox(
      displayBox,
      posAxis,
      cue.lineAlign === "center" ? size / 2 : cue.lineAlign === "end" ? size : 0
    );
    axis = isHorizontal ? ["-y", "+y", "-x", "+x"] : ["-x", "+x", "-y", "+y"];
  }
  displayBox = avoidBoxCollisions(container, displayBox, boxes, axis);
  setBoxCSSVars(displayEl, container, displayBox, "cue");
  return displayBox;
}
function createStartingBox(container, cueEl) {
  const box = createBox(cueEl), pos = getStyledPositions(cueEl);
  cueEl[POSITION_OVERRIDE] = false;
  if (pos.top) {
    const top = pos.top / 100 * container.height;
    box.top = top;
    box.bottom = top + box.height;
    cueEl[POSITION_OVERRIDE] = "top";
  }
  if (pos.bottom) {
    const bottom = container.height - pos.bottom / 100 * container.height;
    box.top = bottom - box.height;
    box.bottom = bottom;
    cueEl[POSITION_OVERRIDE] = "bottom";
  }
  if (pos.left)
    box.left = pos.left / 100 * container.width;
  if (pos.right)
    box.right = container.width - pos.right / 100 * container.width;
  return createCSSBox(container, box);
}
function getStyledPositions(el) {
  const positions = {};
  for (const side of BOX_SIDES) {
    positions[side] = parseFloat(el.style.getPropertyValue(`--cue-${side}`));
  }
  return positions;
}
function computeCueLine(cue) {
  if (cue.line === "auto") {
    if (!cue.snapToLines) {
      return 100;
    } else {
      return -1;
    }
  }
  return cue.line;
}
function computeCuePosition(cue) {
  if (cue.position === "auto") {
    switch (cue.align) {
      case "start":
      case "left":
        return 0;
      case "right":
      case "end":
        return 100;
      default:
        return 50;
    }
  }
  return cue.position;
}
function computeCuePositionAlignment(cue, dir) {
  if (cue.positionAlign === "auto") {
    switch (cue.align) {
      case "start":
        return dir === "ltr" ? "line-left" : "line-right";
      case "end":
        return dir === "ltr" ? "line-right" : "line-left";
      case "center":
        return "center";
      default:
        return `line-${cue.align}`;
    }
  }
  return cue.positionAlign;
}
var REGION_AXIS = ["-y", "+y", "-x", "+x"];
function positionRegion(container, region, regionEl, boxes) {
  let cues = Array.from(regionEl.querySelectorAll('[part="cue-display"]')), height = 0, limit = Math.max(0, cues.length - region.lines);
  for (let i = cues.length - 1; i >= limit; i--) {
    height += cues[i].offsetHeight;
  }
  setCSSVar(regionEl, "region-height", height + "px");
  if (!regionEl[STARTING_BOX]) {
    regionEl[STARTING_BOX] = createCSSBox(container, createBox(regionEl));
  }
  let box = { ...regionEl[STARTING_BOX] };
  box = resolveRelativeBox(container, box);
  box.width = regionEl.clientWidth;
  box.height = height;
  box.right = box.left + box.width;
  box.bottom = box.top + height;
  box = avoidBoxCollisions(container, box, boxes, REGION_AXIS);
  setBoxCSSVars(regionEl, container, box, "region");
  return box;
}
var CaptionsRenderer = class {
  constructor(overlay, init) {
    this._currentTime = 0;
    this._dir = "ltr";
    this._activeCues = [];
    this._resizeRafID = -1;
    this._updateRafID = -1;
    this._regions = /* @__PURE__ */ new Map();
    this._cues = /* @__PURE__ */ new Map();
    this.overlay = overlay;
    this.dir = init?.dir ?? "ltr";
    setPartAttr(overlay, "captions");
    this._updateOverlay();
    this._resizeObserver = new ResizeObserver(this._resize.bind(this));
    this._resizeObserver.observe(overlay);
  }
  /* Text direction. */
  get dir() {
    return this._dir;
  }
  set dir(dir) {
    this._dir = dir;
    setDataAttr(this.overlay, "dir", dir);
  }
  get currentTime() {
    return this._currentTime;
  }
  set currentTime(time) {
    this._currentTime = time;
    this.update();
  }
  changeTrack({ regions, cues }) {
    this.reset();
    this._buildRegions(regions);
    for (const cue of cues)
      this._cues.set(cue, null);
    this.update();
  }
  addCue(cue) {
    this._cues.set(cue, null);
    this.update();
  }
  removeCue(cue) {
    this._cues.delete(cue);
    this.update();
  }
  update(forceUpdate = false) {
    if (this._updateRafID >= 0)
      return;
    this._updateRafID = requestAnimationFrame(() => {
      this._render(forceUpdate);
      this._updateRafID = -1;
    });
  }
  reset() {
    cancelAnimationFrame(this._updateRafID);
    this._updateRafID = -1;
    this._cues.clear();
    this._regions.clear();
    this._activeCues = [];
    this.overlay.textContent = "";
  }
  destroy() {
    this.reset();
    this._resizeObserver.disconnect();
  }
  _resize() {
    if (this._resizeRafID >= 0)
      return;
    this._resizeRafID = requestAnimationFrame(() => {
      this._updateOverlay();
      this._resizeRafID = -1;
      if (this._regions.size)
        this._render(true);
    });
  }
  _updateOverlay() {
    this._overlayBox = createBox(this.overlay);
    setCSSVar(this.overlay, "overlay-width", this._overlayBox.width + "px");
    setCSSVar(this.overlay, "overlay-height", this._overlayBox.height + "px");
  }
  _render(forceUpdate = false) {
    if (!this._cues.size)
      return;
    let cue, activeCues = [...this._cues.keys()].filter((cue2) => this._currentTime >= cue2.startTime && this._currentTime <= cue2.endTime).sort(
      (cueA, cueB) => cueA.startTime !== cueB.startTime ? cueA.startTime - cueB.startTime : cueA.endTime - cueB.endTime
    ), activeRegions = activeCues.map((cue2) => cue2.region);
    for (let i = 0; i < this._activeCues.length; i++) {
      cue = this._activeCues[i];
      if (activeCues[i] === cue)
        continue;
      if (cue.region && !activeRegions.includes(cue.region)) {
        const regionEl = this._regions.get(cue.region.id);
        if (regionEl) {
          regionEl.removeAttribute("data-active");
          forceUpdate = true;
        }
      }
      const cueEl = this._cues.get(cue);
      if (cueEl) {
        cueEl.remove();
        forceUpdate = true;
      }
    }
    for (let i = 0; i < activeCues.length; i++) {
      cue = activeCues[i];
      let cueEl = this._cues.get(cue);
      if (!cueEl)
        this._cues.set(cue, cueEl = this._createCueElement(cue));
      const regionEl = this._hasRegion(cue) && this._regions.get(cue.region.id);
      if (regionEl && !regionEl.hasAttribute("data-active")) {
        requestAnimationFrame(() => {
          setDataAttr(regionEl, "active");
        });
        forceUpdate = true;
      }
      if (!cueEl.isConnected) {
        (regionEl || this.overlay).append(cueEl);
        forceUpdate = true;
      }
    }
    if (forceUpdate) {
      const boxes = [], seen = /* @__PURE__ */ new Set();
      for (let i = activeCues.length - 1; i >= 0; i--) {
        cue = activeCues[i];
        if (seen.has(cue.region || cue))
          continue;
        const isRegion = this._hasRegion(cue), el = isRegion ? this._regions.get(cue.region.id) : this._cues.get(cue);
        if (isRegion) {
          boxes.push(positionRegion(this._overlayBox, cue.region, el, boxes));
        } else {
          boxes.push(positionCue(this._overlayBox, cue, el, boxes));
        }
        seen.add(isRegion ? cue.region : cue);
      }
    }
    updateTimedVTTCueNodes(this.overlay, this._currentTime);
    this._activeCues = activeCues;
  }
  _buildRegions(regions) {
    if (!regions)
      return;
    for (const region of regions) {
      const el = this._createRegionElement(region);
      if (el) {
        this._regions.set(region.id, el);
        this.overlay.append(el);
      }
    }
  }
  _createRegionElement(region) {
    const el = document.createElement("div");
    setPartAttr(el, "region");
    setDataAttr(el, "id", region.id);
    setDataAttr(el, "scroll", region.scroll);
    setCSSVar(el, "region-width", region.width + "%");
    setCSSVar(el, "region-anchor-x", region.regionAnchorX);
    setCSSVar(el, "region-anchor-y", region.regionAnchorY);
    setCSSVar(el, "region-viewport-anchor-x", region.viewportAnchorX);
    setCSSVar(el, "region-viewport-anchor-y", region.viewportAnchorY);
    setCSSVar(el, "region-lines", region.lines);
    return el;
  }
  _createCueElement(cue) {
    const display = document.createElement("div"), position = computeCuePosition(cue), positionAlignment = computeCuePositionAlignment(cue, this._dir);
    setPartAttr(display, "cue-display");
    if (cue.vertical !== "")
      setDataAttr(display, "vertical");
    setCSSVar(display, "cue-text-align", cue.align);
    if (cue.style) {
      for (const prop of Object.keys(cue.style)) {
        display.style.setProperty(prop, cue.style[prop]);
      }
    }
    if (!this._hasRegion(cue)) {
      setCSSVar(
        display,
        "cue-writing-mode",
        cue.vertical === "" ? "horizontal-tb" : cue.vertical === "lr" ? "vertical-lr" : "vertical-rl"
      );
      if (!cue.style?.["--cue-width"]) {
        let maxSize = position;
        if (positionAlignment === "line-left") {
          maxSize = 100 - position;
        } else if (positionAlignment === "center" && position <= 50) {
          maxSize = position * 2;
        } else if (positionAlignment === "center" && position > 50) {
          maxSize = (100 - position) * 2;
        }
        const size = cue.size < maxSize ? cue.size : maxSize;
        if (cue.vertical === "")
          setCSSVar(display, "cue-width", size + "%");
        else
          setCSSVar(display, "cue-height", size + "%");
      }
    } else {
      setCSSVar(
        display,
        "cue-offset",
        `${position - (positionAlignment === "line-right" ? 100 : positionAlignment === "center" ? 50 : 0)}%`
      );
    }
    const el = document.createElement("div");
    setPartAttr(el, "cue");
    if (cue.id)
      setDataAttr(el, "id", cue.id);
    el.innerHTML = renderVTTCueString(cue);
    display.append(el);
    return display;
  }
  _hasRegion(cue) {
    return cue.region && cue.size === 100 && cue.vertical === "" && cue.line === "auto";
  }
};

export { CaptionsRenderer, createVTTCueTemplate, parseByteStream, parseResponse, parseText, parseTextStream, renderVTTCueString, renderVTTTokensString, tokenizeVTTCue, updateTimedVTTCueNodes };
