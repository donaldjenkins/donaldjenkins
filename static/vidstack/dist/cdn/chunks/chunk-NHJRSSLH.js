import { f, P, F as F$1, x } from './chunk-OQQW4RVA.js';
import { p, v, t, s, h, q as q$1 } from './chunk-KZR5HH3N.js';

var ge=navigator?.userAgent.toLowerCase(),he=/iphone|ipad|ipod|ios|crios|fxios/i.test(ge),et=!!window.chrome,N=!!window.safari||he;function tt(){return !p(screen.orientation)&&v(screen.orientation.lock)&&v(screen.orientation.unlock)}function nt(e){return e||(e=document.createElement("video")),e.canPlayType("application/vnd.apple.mpegurl").length>0}function it(e){return !!document.pictureInPictureEnabled&&!e.disablePictureInPicture}function rt(e){return v(e.webkitSupportsPresentationMode)&&v(e.webkitSetPresentationMode)}function ye(){return window?.MediaSource??window?.WebKitMediaSource}function be(){return window?.SourceBuffer??window?.WebKitSourceBuffer}function ot(){let e=ye();if(p(e))return !1;let n=e&&v(e.isTypeSupported)&&e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),o=be(),i=p(o)||!p(o.prototype)&&v(o.prototype.appendBuffer)&&v(o.prototype.remove);return !!n&&!!i}var st=/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,ct=new Set(["audio/mpeg","audio/ogg","audio/3gp","audio/mp4","audio/webm","audio/flac"]),dt=/\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i,mt=new Set(["video/mp4","video/webm","video/3gp","video/ogg","video/avi","video/mpeg"]),Te=/\.(m3u8)($|\?)/i,Le=new Set(["application/vnd.apple.mpegurl","audio/mpegurl","audio/x-mpegurl","application/x-mpegurl","video/x-mpegurl","video/mpegurl","application/mpegurl"]);function H({src:e,type:n}){return t(e)&&Te.test(e)||Le.has(n)}function B(e){return !p(window.MediaStream)&&e instanceof window.MediaStream}function U(e){let n;function o(){p(n)&&i();}function i(){n=window.requestAnimationFrame(function(){p(n)||(e(),i());});}function R(){s(n)&&window.cancelAnimationFrame(n),n=void 0;}return {start:o,stop:R}}var F=Symbol(0),Y=Symbol(0),_t=Symbol(0),W=Symbol(0),Et=Symbol(0),St=Symbol(0),gt=Symbol(0),ht=Symbol(0),yt=Symbol(0);function Tt(e,n=2){return Number(e.toFixed(n))}function L(e){return String(e).split(".")[1]?.length??0}function Lt(e,n,o){return Math.max(e,Math.min(o,n))}function j(e,{player:n,$store:o,delegate:i,logger:R,audioTracks:p}){let g=P(),l=!1,M=!1,x$1=!1,E=U(()=>{let t=e.currentTime;o.currentTime!==t&&f(t);});K(),X(),h(()=>{E.stop(),g.empty();});function r(t,c){return F$1(e.media,t,c)}function K(){r("loadstart",J),r("abort",w),r("emptied",Q),r("error",Se);}function X(){if("audioTracks"in e.media){let I=function(u){let a=u.track,d={id:a.id+"",label:a.label,language:a.language,kind:a.kind,selected:!1};p[F](d,u),a.enabled&&(d.selected=!0);},k=function(u){let a=p.getById(u.track.id);a&&p[Y](a,u);},y=function(){return Array.from(_).find(u=>u.enabled)},v=function(u){let a=y();if(!a)return;let d=p.getById(a.id);d&&p[W](d,!0,u);};let _=e.media.audioTracks;_.onaddtrack=I,_.onremovetrack=k,_.onchange=v,p.addEventListener("change",u=>{let{current:a}=u.detail,d=_.getTrackById(a.id);if(d){let V=y();V&&(V.enabled=!1),d.enabled=!0;}});}}function G(){M||(g.add(r("loadeddata",Z),r("loadedmetadata",$),r("canplay",ie),r("canplaythrough",re),r("durationchange",ce),r("play",te),r("progress",le),r("stalled",ae),r("suspend",_e)),M=!0);}function z(){x$1||(g.add(r("pause",ne),r("playing",oe),r("ratechange",Ee),r("seeked",me),r("seeking",pe),r("ended",se),r("volumechange",de),r("waiting",ue)),x$1=!0);}function f(t,c){i.dispatch("time-update",{detail:{currentTime:Math.min(t,o.seekableEnd),played:e.media.played},trigger:c});}function w(t){i.dispatch("abort",{trigger:t});}function J(t){if(e.media.networkState===3){w(t);return}G(),i.dispatch("load-start",{trigger:t});}function Q(t){i.dispatch("emptied",{trigger:t});}function Z(t){i.dispatch("loaded-data",{trigger:t});}function $(t){ee(),z(),i.dispatch("volume-change",{detail:{volume:e.media.volume,muted:e.media.muted}}),i.dispatch("loaded-metadata",{trigger:t}),N&&H(o.source)&&i.ready(h$1(),t);}function h$1(){return {duration:e.media.duration,buffered:e.media.buffered,seekable:e.media.seekable}}function ee(){if(o.streamType!=="unknown")return;let t=!Number.isFinite(e.media.duration);i.dispatch("stream-type-change",{detail:t?"live":"on-demand"});}function te(t){o.canPlay&&i.dispatch("play",{trigger:t});}function ne(t){e.media.readyState===1&&!l||(l=!1,E.stop(),i.dispatch("pause",{trigger:t}));}function ie(t){i.ready(h$1(),t);}function re(t){o.started||i.dispatch("can-play-through",{trigger:t,detail:h$1()});}function oe(t){l=!1,i.dispatch("playing",{trigger:t}),E.start();}function ae(t){i.dispatch("stalled",{trigger:t}),e.media.readyState<3&&(l=!0,i.dispatch("waiting",{trigger:t}));}function ue(t){e.media.readyState<3&&(l=!0,i.dispatch("waiting",{trigger:t}));}function se(t){E.stop(),f(e.media.duration,t),i.dispatch("end",{trigger:t}),o.loop?fe():i.dispatch("ended",{trigger:t});}function ce(t){o.ended&&f(e.media.duration,t),i.dispatch("duration-change",{detail:e.media.duration,trigger:t});}function de(t){i.dispatch("volume-change",{detail:{volume:e.media.volume,muted:e.media.muted},trigger:t});}function me(t){f(e.media.currentTime,t),i.dispatch("seeked",{detail:e.media.currentTime,trigger:t}),Math.trunc(e.media.currentTime)===Math.trunc(e.media.duration)&&L(e.media.duration)>L(e.media.currentTime)&&(f(e.media.duration,t),e.media.ended||x(n,"media-play-request",{trigger:t}));}function pe(t){i.dispatch("seeking",{detail:e.media.currentTime,trigger:t});}function le(t){i.dispatch("progress",{detail:{buffered:e.media.buffered,seekable:e.media.seekable},trigger:t});}function fe(){q$1(e.media.controls)&&(e.media.controls=!1),x(n,"media-loop-request");}function _e(t){i.dispatch("suspend",{trigger:t});}function Ee(t){i.dispatch("rate-change",{detail:e.media.playbackRate,trigger:t});}function Se(t){let c=e.media.error;c&&i.dispatch("error",{detail:{message:c.message,code:c.code,mediaError:c},trigger:t});}}var q=class{constructor(n){this.oe=n;}setup(n){j(this,n);}get type(){return ""}get media(){return this.oe}get paused(){return this.oe.paused}get muted(){return this.oe.muted}set muted(n){this.oe.muted=n;}get volume(){return this.oe.volume}set volume(n){this.oe.volume=n;}get currentTime(){return this.oe.currentTime}set currentTime(n){this.oe.currentTime=n;}get playsinline(){return this.oe.hasAttribute("playsinline")}set playsinline(n){f(this.oe,"playsinline",n);}get playbackRate(){return this.oe.playbackRate}set playbackRate(n){this.oe.playbackRate=n;}async play(){return this.oe.play()}async pause(){return this.oe.pause()}async loadSource({src:n},o){this.oe.preload=o,B(n)?this.oe.srcObject=n:(this.oe.srcObject=null,this.oe.src=t(n)?n:window.URL.createObjectURL(n)),this.oe.load();}};

export { U as A, q as B, Tt as a, L as b, Lt as c, F as d, Y as e, _t as f, W as g, Et as h, St as i, gt as j, ht as k, yt as l, et as m, N as n, tt as o, nt as p, it as q, rt as r, ot as s, st as t, ct as u, dt as v, mt as w, Te as x, Le as y, H as z };