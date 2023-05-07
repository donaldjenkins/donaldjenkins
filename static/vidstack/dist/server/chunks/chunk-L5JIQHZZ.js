import 'maverick.js/std';

// src/utils/support.ts
var IS_CHROME = false;
var IS_SAFARI = false;
function canOrientScreen() {
  return false;
}
function canPlayHLSNatively(video) {
  return false;
}
function canUsePictureInPicture(video) {
  return false;
}
function canUseVideoPresentation(video) {
  return false;
}
function isHLSSupported() {
  return false;
}

export { IS_CHROME, IS_SAFARI, canOrientScreen, canPlayHLSNatively, canUsePictureInPicture, canUseVideoPresentation, isHLSSupported };
