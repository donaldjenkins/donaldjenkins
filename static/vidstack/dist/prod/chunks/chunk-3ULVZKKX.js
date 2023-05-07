import { createContext, useContext } from 'maverick.js';

// src/player/media/context.ts
var mediaContext = createContext();
function useMedia() {
  return useContext(mediaContext);
}

export { mediaContext, useMedia };
