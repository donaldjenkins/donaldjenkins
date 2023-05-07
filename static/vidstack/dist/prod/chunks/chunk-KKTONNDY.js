import { isUndefined, isFunction } from 'maverick.js/std';

// src/utils/support.ts
var UA = navigator?.userAgent.toLowerCase();
var IS_IOS = /iphone|ipad|ipod|ios|crios|fxios/i.test(UA);
var IS_CHROME = !!window.chrome;
var IS_SAFARI = !!window.safari || IS_IOS;
function canOrientScreen() {
  return !isUndefined(screen.orientation) && isFunction(screen.orientation.lock) && isFunction(screen.orientation.unlock);
}
function canPlayHLSNatively(video) {
  if (!video)
    video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl").length > 0;
}
function canUsePictureInPicture(video) {
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
}
function canUseVideoPresentation(video) {
  return isFunction(video.webkitSupportsPresentationMode) && isFunction(video.webkitSetPresentationMode);
}
function getMediaSource() {
  return window?.MediaSource ?? window?.WebKitMediaSource;
}
function getSourceBuffer() {
  return window?.SourceBuffer ?? window?.WebKitSourceBuffer;
}
function isHLSSupported() {
  const MediaSource = getMediaSource();
  if (isUndefined(MediaSource))
    return false;
  const isTypeSupported = MediaSource && isFunction(MediaSource.isTypeSupported) && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
  const SourceBuffer = getSourceBuffer();
  const isSourceBufferValid = isUndefined(SourceBuffer) || !isUndefined(SourceBuffer.prototype) && isFunction(SourceBuffer.prototype.appendBuffer) && isFunction(SourceBuffer.prototype.remove);
  return !!isTypeSupported && !!isSourceBufferValid;
}

export { IS_CHROME, IS_SAFARI, canOrientScreen, canPlayHLSNatively, canUsePictureInPicture, canUseVideoPresentation, isHLSSupported };
