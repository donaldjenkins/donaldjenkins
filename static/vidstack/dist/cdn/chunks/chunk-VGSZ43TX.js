var E=",",A="%";function I(t){let s=parseInt(t,10);return Number.isNaN(s)?null:s}function p(t){let s=parseInt(t.replace(A,""),10);return !Number.isNaN(s)&&s>=0&&s<=100?s:null}function T(t){if(!t.includes(E))return null;let[s,e]=t.split(E).map(p);return s!==null&&e!==null?[s,e]:null}function R(t){let s=parseFloat(t);return Number.isNaN(s)?null:s}var Y=class extends EventTarget{constructor(t,s,e){super(),this.id="",this.pauseOnExit=!1,this.startTime=t,this.endTime=s,this.text=e;}addEventListener(t,s,e){super.addEventListener(t,s,e);}removeEventListener(t,s,e){super.removeEventListener(t,s,e);}},_=window.VTTCue,b=class extends _{constructor(){super(...arguments),this.region=null,this.vertical="",this.snapToLines=!0,this.line="auto",this.lineAlign="start",this.position="auto",this.positionAlign="auto",this.size=100,this.align="center";}},w=class{constructor(){this.id="",this.width=100,this.lines=3,this.regionAnchorX=0,this.regionAnchorY=100,this.viewportAnchorX=0,this.viewportAnchorY=100,this.scroll="";}},x="WEBVTT",N=",",k="%",o=/[:=]/,P=/[\s\t]*\w+[:=]/,S="NOTE",L="REGION",O=/^REGION:?[\s\t]+/,f=/[\s\t]+/,G="-->",M=/[\s\t]*-->[\s\t]+/,C=/start|center|end|left|right/,y=/start|center|end/,z=/line-(?:left|right)|center|auto/,H=/^(?:(\d{1,2}):)?(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/,W=(t=>(t[t.None=0]="None",t[t.Header=1]="Header",t[t.Cue=2]="Cue",t[t.Region=3]="Region",t[t.Note=4]="Note",t))(W||{}),X=class{constructor(){this.k=0,this.x={},this.l={},this.d=[],this.a=null,this.g=null,this.p=[],this.t="";}async init(t){this.f=t,t.strict&&(this.k=1),t.errors&&(this.e=(await import('./errors-7ZCJBJFL-CHNCJDQB.js')).ParseErrorBuilder);}parse(t,s){if(t==="")this.a?(this.d.push(this.a),this.f.onCue?.(this.a),this.a=null):this.g?(this.l[this.g.id]=this.g,this.f.onRegion?.(this.g),this.g=null):this.k===1&&(this.y(t,s),this.f.onHeaderMetadata?.(this.x)),this.k=0;else if(this.k)switch(this.k){case 1:this.y(t,s);break;case 2:if(this.a){let e=this.a.text.length>0;!e&&P.test(t)?this.I(t.split(f),s):this.a.text+=(e?`
`:"")+t;}break;case 3:this.J(t.split(f),s);break}else if(t.startsWith(S))this.k=4;else if(t.startsWith(L))this.k=3,this.g=new w,this.J(t.replace(O,"").split(f),s);else if(t.includes(G)){let e=this.o(t,s);e&&(this.a=new b(e[0],e[1],""),this.a.id=this.t,this.I(e[2],s)),this.k=2;}else s===1&&this.y(t,s);this.t=t;}done(){return {metadata:this.x,cues:this.d,regions:Object.values(this.l),errors:this.p}}y(t,s){if(s>1){if(o.test(t)){let[e,r]=t.split(o);e&&(this.x[e]=(r||"").replace(f,""));}}else t.startsWith(x)?this.k=1:this.h(this.e?.P());}o(t,s){let[e,r=""]=t.split(M),[n,...i]=r.split(f),a=m(e),h=m(n);if(a!==null&&h!==null&&h>a)return [a,h,i];a===null&&this.h(this.e?.E(e,s)),h===null&&this.h(this.e?.F(n,s)),a!=null&&h!==null&&h>a&&this.h(this.e?.G(a,h,s));}J(t,s){let e;for(let r=0;r<t.length;r++)if(o.test(t[r])){e=!1;let[n,i]=t[r].split(o);switch(n){case"id":this.g.id=i;break;case"width":let a=p(i);a!==null?this.g.width=a:e=!0;break;case"lines":let h=I(i);h!==null?this.g.lines=h:e=!0;break;case"regionanchor":let l=T(i);l!==null?(this.g.regionAnchorX=l[0],this.g.regionAnchorY=l[1]):e=!0;break;case"viewportanchor":let u=T(i);u!==null?(this.g.viewportAnchorX=u[0],this.g.viewportAnchorY=u[1]):e=!0;break;case"scroll":i==="up"?this.g.scroll="up":e=!0;break;default:this.h(this.e?.T(n,i,s));}e&&this.h(this.e?.S(n,i,s));}}I(t,s){let e;for(let r=0;r<t.length;r++)if(e=!1,o.test(t[r])){let[n,i]=t[r].split(o);switch(n){case"region":let a=this.l[i];a&&(this.a.region=a);break;case"vertical":i==="lr"||i==="rl"?(this.a.vertical=i,this.a.region=null):e=!0;break;case"line":let[h,l]=i.split(N);if(h.includes(k)){let c=p(h);c!==null?(this.a.line=c,this.a.snapToLines=!1):e=!0;}else {let c=R(h);c!==null?this.a.line=c:e=!0;}y.test(l)?this.a.lineAlign=l:l&&(e=!0),this.a.line!=="auto"&&(this.a.region=null);break;case"position":let[u,g]=i.split(N),v=p(u);v!==null?this.a.position=v:e=!0,g&&z.test(g)?this.a.positionAlign=g:g&&(e=!0);break;case"size":let d=p(i);d!==null?(this.a.size=d,d<100&&(this.a.region=null)):e=!0;break;case"align":C.test(i)?this.a.align=i:e=!0;break;default:this.h(this.e?.R(n,i,s));}e&&this.h(this.e?.Q(n,i,s));}}h(t){if(t){if(this.p.push(t),this.f.strict)throw this.f.cancel(),t;this.f.onError?.(t);}}};function m(t){let s=t.match(H);if(!s)return null;let e=s[1]?parseInt(s[1],10):0,r=parseInt(s[2],10),n=parseInt(s[3],10),i=s[4]?parseInt(s[4],10):0,a=e*3600+r*60+n+i/1e3;return e<0||r<0||n<0||i<0||r>59||n>59?null:a}function F(){return new X}

export { Y as a, b, w as c, W as d, X as e, m as f, F as g };