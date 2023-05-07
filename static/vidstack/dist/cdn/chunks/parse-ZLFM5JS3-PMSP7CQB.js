import { VTTParser, VTTCue } from './chunk-UMPGLVMI.js';

// ../../node_modules/.pnpm/media-captions@0.0.8/node_modules/media-captions/dist/chunks/parse-ZLFM5JS3.js
var MILLISECOND_SEP_RE = /,/g;
var TIMESTAMP_SEP = "-->";
var SRTParser = class extends VTTParser {
  parse(line, lineCount) {
    if (line === "") {
      if (this._cue) {
        this._cues.push(this._cue);
        this._init.onCue?.(this._cue);
        this._cue = null;
      }
      this._block = 0;
    } else if (this._block === 2) {
      this._cue.text += (this._cue.text ? "\n" : "") + line;
    } else if (line.includes(TIMESTAMP_SEP)) {
      const result = this._parseTimestamp(line, lineCount);
      if (result) {
        this._cue = new VTTCue(result[0], result[1], result[2].join(" "));
        this._cue.id = this._prevLine;
        this._block = 2;
      }
    }
    this._prevLine = line;
  }
  _parseTimestamp(line, lineCount) {
    return super._parseTimestamp(line.replace(MILLISECOND_SEP_RE, "."), lineCount);
  }
};
function createSRTParser() {
  return new SRTParser();
}

export { SRTParser, createSRTParser as default };
