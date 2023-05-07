import { e, b } from './chunk-VGSZ43TX.js';

var a=/,/g,h="-->",u=class extends e{parse(t,e){if(t==="")this.a&&(this.d.push(this.a),this.f.onCue?.(this.a),this.a=null),this.k=0;else if(this.k===2)this.a.text+=(this.a.text?`
`:"")+t;else if(t.includes(h)){let s=this.o(t,e);s&&(this.a=new b(s[0],s[1],s[2].join(" ")),this.a.id=this.t,this.k=2);}this.t=t;}o(t,e){return super.o(t.replace(a,"."),e)}};function f(){return new u}

export { u as SRTParser, f as default };
