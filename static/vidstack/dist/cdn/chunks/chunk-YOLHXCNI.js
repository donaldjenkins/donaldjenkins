// ../../node_modules/.pnpm/media-captions@0.0.8/node_modules/media-captions/dist/chunks/chunk-NKFR2J3N.js
var ParseErrorCode = {
  LoadFail: 0,
  BadSignature: 1,
  BadTimestamp: 2,
  BadSettingValue: 3,
  BadFormat: 4,
  UnknownSetting: 5
};
var ParseError = class extends Error {
  constructor(init) {
    super(init.reason);
    this.code = init.code;
    this.line = init.line;
  }
};

export { ParseError, ParseErrorCode };