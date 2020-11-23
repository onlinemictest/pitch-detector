"use strict";
/**
 * Copyright (C) 2020 Online Mic Test
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license
 */console.log("Licensed under AGPL-3.0: https://github.com/onlinemictest/pitch-detector");const e=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],t=(e,...t)=>{e.classList.remove(...t),e.offsetWidth,e.classList.add(...t)};function n(t){const n=function(e){const t=Math.log(e/440)/Math.log(2)*12;return Math.round(t)+69}(t);return{value:n%12,index:n,name:e[n%12],cents:o(t,n),octave:Math.trunc(n/12)-1,frequency:t}}function o(e,t){return Math.floor(1200*Math.log(e/function(e){return 440*Math.pow(2,(e-69)/12)}(t))/Math.log(2))}Aubio().then((({Pitch:e})=>{var o,i,r;if(function(){if(window.AudioContext=window.AudioContext||window.webkitAudioContext,!window.AudioContext)return alert("AudioContext not supported");void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){const t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return t||alert("getUserMedia is not implemented in this browser"),new Promise((function(n,o){t.call(navigator,e,n,o)}))})}(),!("WebAssembly"in window&&"AudioContext"in window&&"createAnalyser"in AudioContext.prototype&&"createScriptProcessor"in AudioContext.prototype&&"trunc"in Math))return alert("Browser not supported");const a=document.getElementById("pitch-wheel-svg"),c=null===(o=document.getElementById("pitch-freq"))||void 0===o?void 0:o.querySelector(".freq"),d=null===(i=document.getElementById("pitch-freq"))||void 0===i?void 0:i.querySelector(".note"),s=null===(r=document.getElementById("pitch-freq"))||void 0===r?void 0:r.querySelector(".octave"),l=document.getElementById("audio-start"),u=document.getElementById("audio-pause"),m=document.getElementById("pitch-freq-text"),y=document.querySelector(".audio-block-2");if(!(a&&c&&d&&s&&l&&u&&m))return;let p,v,g,h;u.addEventListener("click",(()=>{g.disconnect(p.destination),v.disconnect(g),p.close(),l.style.display="block",u.style.display="none",m.style.display="none",y&&(y.style.display="block"),t(l,"blob-animation")})),l.addEventListener("click",(()=>{p=new AudioContext,v=p.createAnalyser(),g=p.createScriptProcessor(4096,1,1),h=new e("default",4096,1,p.sampleRate),navigator.mediaDevices.getUserMedia({audio:!0}).then((e=>{p.createMediaStreamSource(e).connect(v),v.connect(g),g.connect(p.destination),l.style.display="none",u.style.display="block",m.style.display="block",y&&(y.style.display="none"),t(u,"shrink-animation");let o=0;g.addEventListener("audioprocess",(e=>{const t=n(h.do(e.inputBuffer.getChannelData(0))),i=15*t.index+t.cents/100*15;if(t.name){const e=Math.trunc(Math.abs(o-i));o=i;const n=15*(e+25);c.innerText=t.frequency.toFixed(1),d.innerText=t.name,s.innerText=t.octave.toString(),a.style.transition=`transform ${n}ms ease`,a.style.transform=`rotate(-${i}deg)`}}))}))}))}));
//# sourceMappingURL=index.js.map
