import { deferredPromise, isNull } from 'maverick.js/std';

// src/utils/network.ts
function preconnect(url, rel = "preconnect") {
  return false;
}
var pendingRequests = {};
function loadScript(src) {
  if (pendingRequests[src])
    return pendingRequests[src].promise;
  const promise = deferredPromise(), exists = document.querySelector(`script[src="${src}"]`);
  if (!isNull(exists)) {
    promise.resolve();
    return promise.promise;
  }
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };
  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };
  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}

export { loadScript, preconnect };
