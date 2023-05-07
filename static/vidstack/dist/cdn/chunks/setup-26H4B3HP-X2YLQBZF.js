import { a } from './chunk-VNETULCR.js';
import { N, a as a$1 } from './chunk-KZR5HH3N.js';

async function d(t){let e=u(t),o=t.constructor,n=o.c;if(e&&(await customElements.whenDefined(e.localName),e[N]===!0||await new Promise(r=>e[N].push(r))),t.isConnected){let r=a(n,{props:f(t),scope:e?.instance[a$1]});e?.keepAlive&&(t.keepAlive=!0),t.attachComponent(r);}}function f(t){let e=t.constructor,o={};if(!e.f)return o;for(let n of e.f.keys())if(t.hasAttribute(n)){let r=e.f.get(n),s=e.c.props[r].type?.from;if(s){let p=t.getAttribute(n);o[r]=s(p);}}return o}function u(t){let e=t.constructor,o=t.parentNode,n=e.c.tagName.split("-",1)[0]+"-";for(;o;){if(o.nodeType===1&&o.localName.startsWith(n))return o;o=o.parentNode;}return null}

export { d as setup };
