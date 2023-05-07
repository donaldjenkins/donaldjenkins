// ../../node_modules/.pnpm/media-captions@0.0.8/node_modules/media-captions/dist/chunks/chunk-665KQXAY.js
var COMMA = ",";
var PERCENT_SIGN = "%";
function toNumber(text) {
  const num = parseInt(text, 10);
  return !Number.isNaN(num) ? num : null;
}
function toPercentage(text) {
  const num = parseInt(text.replace(PERCENT_SIGN, ""), 10);
  return !Number.isNaN(num) && num >= 0 && num <= 100 ? num : null;
}
function toCoords(text) {
  if (!text.includes(COMMA))
    return null;
  const [x, y] = text.split(COMMA).map(toPercentage);
  return x !== null && y !== null ? [x, y] : null;
}
function toFloat(text) {
  const num = parseFloat(text);
  return !Number.isNaN(num) ? num : null;
}
var TextCue = class extends EventTarget {
  constructor(startTime, endTime, text) {
    super();
    this.id = "";
    this.pauseOnExit = false;
    this.startTime = startTime;
    this.endTime = endTime;
    this.text = text;
  }
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, listener, options);
  }
};
var CueBase = window.VTTCue;
var VTTCue = class extends CueBase {
  constructor() {
    super(...arguments);
    this.region = null;
    this.vertical = "";
    this.snapToLines = true;
    this.line = "auto";
    this.lineAlign = "start";
    this.position = "auto";
    this.positionAlign = "auto";
    this.size = 100;
    this.align = "center";
  }
};
var VTTRegion = class {
  constructor() {
    this.id = "";
    this.width = 100;
    this.lines = 3;
    this.regionAnchorX = 0;
    this.regionAnchorY = 100;
    this.viewportAnchorX = 0;
    this.viewportAnchorY = 100;
    this.scroll = "";
  }
};
var HEADER_MAGIC = "WEBVTT";
var COMMA2 = ",";
var PERCENT_SIGN2 = "%";
var SETTING_SEP_RE = /[:=]/;
var SETTING_LINE_RE = /[\s\t]*\w+[:=]/;
var NOTE_BLOCK_START = "NOTE";
var REGION_BLOCK_START = "REGION";
var REGION_BLOCK_START_RE = /^REGION:?[\s\t]+/;
var SPACE_RE = /[\s\t]+/;
var TIMESTAMP_SEP = "-->";
var TIMESTAMP_SEP_RE = /[\s\t]*-->[\s\t]+/;
var ALIGN_RE = /start|center|end|left|right/;
var LINE_ALIGN_RE = /start|center|end/;
var POS_ALIGN_RE = /line-(?:left|right)|center|auto/;
var TIMESTAMP_RE = /^(?:(\d{1,2}):)?(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
var VTTBlock = /* @__PURE__ */ ((VTTBlock2) => {
  VTTBlock2[VTTBlock2["None"] = 0] = "None";
  VTTBlock2[VTTBlock2["Header"] = 1] = "Header";
  VTTBlock2[VTTBlock2["Cue"] = 2] = "Cue";
  VTTBlock2[VTTBlock2["Region"] = 3] = "Region";
  VTTBlock2[VTTBlock2["Note"] = 4] = "Note";
  return VTTBlock2;
})(VTTBlock || {});
var VTTParser = class {
  constructor() {
    this._block = 0;
    this._metadata = {};
    this._regions = {};
    this._cues = [];
    this._cue = null;
    this._region = null;
    this._errors = [];
    this._prevLine = "";
  }
  async init(init) {
    this._init = init;
    if (init.strict)
      this._block = 1;
    if (init.errors)
      this._errorBuilder = (await import('./errors-VSYRGBIT-UZGMBFPL.js')).ParseErrorBuilder;
  }
  parse(line, lineCount) {
    if (line === "") {
      if (this._cue) {
        this._cues.push(this._cue);
        this._init.onCue?.(this._cue);
        this._cue = null;
      } else if (this._region) {
        this._regions[this._region.id] = this._region;
        this._init.onRegion?.(this._region);
        this._region = null;
      } else if (this._block === 1) {
        this._parseHeader(line, lineCount);
        this._init.onHeaderMetadata?.(this._metadata);
      }
      this._block = 0;
    } else if (this._block) {
      switch (this._block) {
        case 1:
          this._parseHeader(line, lineCount);
          break;
        case 2:
          if (this._cue) {
            const hasText = this._cue.text.length > 0;
            if (!hasText && SETTING_LINE_RE.test(line)) {
              this._parseCueSettings(line.split(SPACE_RE), lineCount);
            } else {
              this._cue.text += (hasText ? "\n" : "") + line;
            }
          }
          break;
        case 3:
          this._parseRegionSettings(line.split(SPACE_RE), lineCount);
          break;
      }
    } else if (line.startsWith(NOTE_BLOCK_START)) {
      this._block = 4;
    } else if (line.startsWith(REGION_BLOCK_START)) {
      this._block = 3;
      this._region = new VTTRegion();
      this._parseRegionSettings(line.replace(REGION_BLOCK_START_RE, "").split(SPACE_RE), lineCount);
    } else if (line.includes(TIMESTAMP_SEP)) {
      const result = this._parseTimestamp(line, lineCount);
      if (result) {
        this._cue = new VTTCue(result[0], result[1], "");
        this._cue.id = this._prevLine;
        this._parseCueSettings(result[2], lineCount);
      }
      this._block = 2;
    } else if (lineCount === 1) {
      this._parseHeader(line, lineCount);
    }
    this._prevLine = line;
  }
  done() {
    return {
      metadata: this._metadata,
      cues: this._cues,
      regions: Object.values(this._regions),
      errors: this._errors
    };
  }
  _parseHeader(line, lineCount) {
    if (lineCount > 1) {
      if (SETTING_SEP_RE.test(line)) {
        const [key, value] = line.split(SETTING_SEP_RE);
        if (key)
          this._metadata[key] = (value || "").replace(SPACE_RE, "");
      }
    } else if (line.startsWith(HEADER_MAGIC)) {
      this._block = 1;
    } else {
      this._handleError(this._errorBuilder?._badVTTHeader());
    }
  }
  _parseTimestamp(line, lineCount) {
    const [startTimeText, trailingText = ""] = line.split(TIMESTAMP_SEP_RE), [endTimeText, ...settingsText] = trailingText.split(SPACE_RE), startTime = parseVTTTimestamp(startTimeText), endTime = parseVTTTimestamp(endTimeText);
    if (startTime !== null && endTime !== null && endTime > startTime) {
      return [startTime, endTime, settingsText];
    } else {
      if (startTime === null) {
        this._handleError(this._errorBuilder?._badStartTimestamp(startTimeText, lineCount));
      }
      if (endTime === null) {
        this._handleError(this._errorBuilder?._badEndTimestamp(endTimeText, lineCount));
      }
      if (startTime != null && endTime !== null && endTime > startTime) {
        this._handleError(this._errorBuilder?._badRangeTimestamp(startTime, endTime, lineCount));
      }
    }
  }
  /**
   * @see {@link https://www.w3.org/TR/webvtt1/#region-settings-parsing}
   */
  _parseRegionSettings(settings, line) {
    let badValue;
    for (let i = 0; i < settings.length; i++) {
      if (SETTING_SEP_RE.test(settings[i])) {
        badValue = false;
        const [name, value] = settings[i].split(SETTING_SEP_RE);
        switch (name) {
          case "id":
            this._region.id = value;
            break;
          case "width":
            const width = toPercentage(value);
            if (width !== null)
              this._region.width = width;
            else
              badValue = true;
            break;
          case "lines":
            const lines = toNumber(value);
            if (lines !== null)
              this._region.lines = lines;
            else
              badValue = true;
            break;
          case "regionanchor":
            const region = toCoords(value);
            if (region !== null) {
              this._region.regionAnchorX = region[0];
              this._region.regionAnchorY = region[1];
            } else
              badValue = true;
            break;
          case "viewportanchor":
            const viewport = toCoords(value);
            if (viewport !== null) {
              this._region.viewportAnchorX = viewport[0];
              this._region.viewportAnchorY = viewport[1];
            } else
              badValue = true;
            break;
          case "scroll":
            if (value === "up")
              this._region.scroll = "up";
            else
              badValue = true;
            break;
          default:
            this._handleError(this._errorBuilder?._unknownRegionSetting(name, value, line));
        }
        if (badValue) {
          this._handleError(this._errorBuilder?._badRegionSetting(name, value, line));
        }
      }
    }
  }
  /**
   * @see {@link https://www.w3.org/TR/webvtt1/#cue-timings-and-settings-parsing}
   */
  _parseCueSettings(settings, line) {
    let badValue;
    for (let i = 0; i < settings.length; i++) {
      badValue = false;
      if (SETTING_SEP_RE.test(settings[i])) {
        const [name, value] = settings[i].split(SETTING_SEP_RE);
        switch (name) {
          case "region":
            const region = this._regions[value];
            if (region)
              this._cue.region = region;
            break;
          case "vertical":
            if (value === "lr" || value === "rl") {
              this._cue.vertical = value;
              this._cue.region = null;
            } else
              badValue = true;
            break;
          case "line":
            const [linePos, lineAlign] = value.split(COMMA2);
            if (linePos.includes(PERCENT_SIGN2)) {
              const percentage = toPercentage(linePos);
              if (percentage !== null) {
                this._cue.line = percentage;
                this._cue.snapToLines = false;
              } else
                badValue = true;
            } else {
              const number = toFloat(linePos);
              if (number !== null)
                this._cue.line = number;
              else
                badValue = true;
            }
            if (LINE_ALIGN_RE.test(lineAlign)) {
              this._cue.lineAlign = lineAlign;
            } else if (lineAlign) {
              badValue = true;
            }
            if (this._cue.line !== "auto")
              this._cue.region = null;
            break;
          case "position":
            const [colPos, colAlign] = value.split(COMMA2), position = toPercentage(colPos);
            if (position !== null)
              this._cue.position = position;
            else
              badValue = true;
            if (colAlign && POS_ALIGN_RE.test(colAlign)) {
              this._cue.positionAlign = colAlign;
            } else if (colAlign) {
              badValue = true;
            }
            break;
          case "size":
            const size = toPercentage(value);
            if (size !== null) {
              this._cue.size = size;
              if (size < 100)
                this._cue.region = null;
            } else {
              badValue = true;
            }
            break;
          case "align":
            if (ALIGN_RE.test(value)) {
              this._cue.align = value;
            } else {
              badValue = true;
            }
            break;
          default:
            this._handleError(this._errorBuilder?._unknownCueSetting(name, value, line));
        }
        if (badValue) {
          this._handleError(this._errorBuilder?._badCueSetting(name, value, line));
        }
      }
    }
  }
  _handleError(error) {
    if (!error)
      return;
    this._errors.push(error);
    if (this._init.strict) {
      this._init.cancel();
      throw error;
    } else {
      this._init.onError?.(error);
    }
  }
};
function parseVTTTimestamp(timestamp) {
  const match = timestamp.match(TIMESTAMP_RE);
  if (!match)
    return null;
  const hours = match[1] ? parseInt(match[1], 10) : 0, minutes = parseInt(match[2], 10), seconds = parseInt(match[3], 10), milliseconds = match[4] ? parseInt(match[4], 10) : 0, total = hours * 3600 + minutes * 60 + seconds + milliseconds / 1e3;
  if (hours < 0 || minutes < 0 || seconds < 0 || milliseconds < 0 || minutes > 59 || seconds > 59) {
    return null;
  }
  return total;
}
function createVTTParser() {
  return new VTTParser();
}

export { TextCue, VTTBlock, VTTCue, VTTParser, VTTRegion, createVTTParser, parseVTTTimestamp };